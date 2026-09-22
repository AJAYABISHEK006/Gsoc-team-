#!/usr/bin/env python3
"""
Dataset Preparation & Stratified Partitioning for Nile Red Microplastic Fluorescence Dataset
=============================================================================================

This script processes the consolidated YOLO annotation files in `Alldataset_annotation/`,
validates bounding box coordinates, performs a stratified Train/Val/Test split (default 70/20/10),
and organizes the dataset into the standard Ultralytics YOLO format:

    datasets/nile-red-microplastics/
    ├── images/ {train, val, test}
    ├── labels/ {train, val, test}
    └── data.yaml

Optionally, it can synthesize realistic Nile Red fluorescence microscopy frames if raw
TIFF/JPG images are not yet downloaded from the upstream source.

Author: Micro-Plastics Research Team
License: MIT
"""

import argparse
import math
import os
import random
import shutil
import sys
from pathlib import Path

import numpy as np
import yaml

# Polymer class mapping per Rermborirak et al. (2025)
CLASS_NAMES = {
    0: "ABS",
    1: "Nylon",
    2: "PE",
    3: "PET",
    4: "PS",
    5: "PVC"
}

CLASS_BGR_COLORS = {
    0: (30, 170, 255),   # ABS (Yellow-orange in BGR)
    1: (40, 255, 180),   # Nylon (Green-yellow)
    2: (50, 220, 240),   # PE (Golden yellow)
    3: (40, 90, 255),    # PET (Red-orange)
    4: (80, 230, 255),   # PS (Bright golden)
    5: (30, 60, 240),    # PVC (Reddish-orange)
}


def find_repo_root() -> Path:
    """Locate the Micro-Plastics repository root directory."""
    cwd = Path.cwd().resolve()
    for parent in [cwd] + list(cwd.parents):
        if (parent / "Alldataset_annotation").is_dir() or (parent / ".git").is_dir():
            return parent
    return cwd


def parse_and_validate_annotation(txt_path: Path):
    """
    Parses an annotation file and checks coordinate boundaries.
    Returns: list of (class_id, x_center, y_center, width, height)
    """
    valid_boxes = []
    with open(txt_path, "r", encoding="utf-8") as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue
            parts = line.split()
            if len(parts) < 5:
                continue
            try:
                cid = int(parts[0])
                xc, yc, w, h = map(float, parts[1:5])
            except ValueError:
                continue

            # Bounds checking (normalized coordinates in [0, 1])
            if not (0.0 <= xc <= 1.0 and 0.0 <= yc <= 1.0):
                continue
            if not (0.0 < w <= 1.0 and 0.0 < h <= 1.0):
                continue

            valid_boxes.append((cid, xc, yc, w, h))
    return valid_boxes


def generate_synthetic_fluorescence_frame(txt_label_path: Path, img_size=(640, 640)):
    """
    Generates a realistic fluorescence microscopy image matching YOLO annotations.
    Simulates dark microscope background, sensor noise, solvatochromic dye emissions,
    and optical point spread function (PSF) blur.
    """
    try:
        import cv2
    except ImportError:
        print("[!] OpenCV is required to generate synthetic images. Please install opencv-python.")
        return None

    w_img, h_img = img_size
    # Dark background with mild sensor noise
    img = np.random.normal(12, 4, (h_img, w_img, 3)).clip(0, 45).astype(np.uint8)

    boxes = parse_and_validate_annotation(txt_label_path)
    for cid, xc, yc, w, h in boxes:
        px_x = int(xc * w_img)
        px_y = int(yc * h_img)
        px_w = max(4, int(w * w_img))
        px_h = max(4, int(h * h_img))

        color = CLASS_BGR_COLORS.get(cid, (200, 200, 200))
        axes = (max(2, px_w // 2), max(2, px_h // 2))
        angle = random.randint(0, 180)

        # Outer fluorescence glow
        glow_color = tuple(max(0, c // 2) for c in color)
        cv2.ellipse(img, (px_x, px_y), (axes[0] + 3, axes[1] + 3), angle, 0, 360, glow_color, -1)
        # Intense particle core
        cv2.ellipse(img, (px_x, px_y), axes, angle, 0, 360, color, -1)

    # Simulate optical point spread function
    img = cv2.GaussianBlur(img, (3, 3), 0)
    return img


def prepare_dataset(
    annotation_dir: Path,
    output_dir: Path,
    train_ratio: float = 0.70,
    val_ratio: float = 0.20,
    test_ratio: float = 0.10,
    seed: int = 42,
    generate_synthetic: bool = False,
    dry_run: bool = False,
):
    """Partitions annotations and establishes YOLO directory hierarchy."""
    if not math.isclose(train_ratio + val_ratio + test_ratio, 1.0, rel_tol=1e-3):
        raise ValueError(f"Ratios must sum to 1.0, got {train_ratio + val_ratio + test_ratio}")

    print(f"[*] Locating annotation sources in: {annotation_dir.resolve()}")
    if not annotation_dir.exists():
        print(f"[!] Annotation directory not found: {annotation_dir}")
        sys.exit(1)

    # Collect files per class
    class_files = {}
    total_frames = 0
    total_boxes = 0

    for cid, cname in CLASS_NAMES.items():
        folder = annotation_dir / cname
        if folder.exists():
            files = sorted(list(folder.glob("*.txt")))
            class_files[cname] = files
            total_frames += len(files)
            for f in files:
                boxes = parse_and_validate_annotation(f)
                total_boxes += len(boxes)
        else:
            class_files[cname] = []

    print(f"[+] Found {total_frames:,} annotated frames with {total_boxes:,} total microplastic bounding boxes.")
    print("-" * 60)
    for cname, files in class_files.items():
        print(f"    - {cname:<8}: {len(files):>5} frames")
    print("-" * 60)

    if dry_run:
        print("[DRY-RUN] No files will be moved, copied, or generated.")
        return

    images_dir = output_dir / "images"
    labels_dir = output_dir / "labels"

    splits = ["train", "val", "test"]
    for split in splits:
        (images_dir / split).mkdir(parents=True, exist_ok=True)
        (labels_dir / split).mkdir(parents=True, exist_ok=True)

    split_counts = {s: 0 for s in splits}
    per_class_split = {cname: {s: 0 for s in splits} for cname in CLASS_NAMES.values()}

    for cid, cname in CLASS_NAMES.items():
        files = class_files.get(cname, [])
        if not files:
            continue

        rnd = random.Random(seed + cid)
        shuffled = list(files)
        rnd.shuffle(shuffled)

        n_total = len(shuffled)
        n_train = int(n_total * train_ratio)
        n_val = int(n_total * val_ratio)

        partition = {
            "train": shuffled[:n_train],
            "val": shuffled[n_train:n_train + n_val],
            "test": shuffled[n_train + n_val:]
        }

        for sname, split_files in partition.items():
            for src_txt in split_files:
                dest_txt = labels_dir / sname / src_txt.name
                shutil.copy2(src_txt, dest_txt)
                split_counts[sname] += 1
                per_class_split[cname][sname] += 1

                if generate_synthetic:
                    dest_img = images_dir / sname / f"{src_txt.stem}.jpg"
                    if not dest_img.exists():
                        syn_frame = generate_synthetic_fluorescence_frame(src_txt)
                        if syn_frame is not None:
                            try:
                                import cv2
                                cv2.imwrite(str(dest_img), syn_frame)
                            except Exception as e:
                                print(f"[!] Error saving synthetic frame {dest_img}: {e}")

    print("\n[+] Stratified Partition Summary:")
    print(f"{'Polymer':<10} {'Train':>8} {'Val':>8} {'Test':>8} {'Total':>8}")
    print("-" * 46)
    for cname in CLASS_NAMES.values():
        t = per_class_split[cname]["train"]
        v = per_class_split[cname]["val"]
        ts = per_class_split[cname]["test"]
        tot = t + v + ts
        print(f"{cname:<10} {t:>8} {v:>8} {ts:>8} {tot:>8}")
    print("-" * 46)
    print(f"{'Total':<10} {split_counts['train']:>8} {split_counts['val']:>8} {split_counts['test']:>8} {sum(split_counts.values()):>8}")

    # Generate or update data.yaml
    data_yaml_path = output_dir / "data.yaml"
    yaml_config = {
        "path": str(output_dir.resolve()).replace("\\", "/"),
        "train": "images/train",
        "val": "images/val",
        "test": "images/test",
        "names": {cid: name for cid, name in CLASS_NAMES.items()}
    }

    with open(data_yaml_path, "w", encoding="utf-8") as f:
        yaml.dump(yaml_config, f, sort_keys=False)

    print(f"[OK] Generated YOLOv8 configuration at: {data_yaml_path.resolve()}")


def main():
    repo_root = find_repo_root()
    default_ann_dir = repo_root / "Alldataset_annotation"
    default_out_dir = repo_root / "datasets" / "nile-red-microplastics"

    parser = argparse.ArgumentParser(
        description="Prepare and partition the Nile Red Microplastic Dataset for YOLOv8."
    )
    parser.add_argument(
        "--annotations",
        type=Path,
        default=default_ann_dir,
        help="Path to Alldataset_annotation directory containing polymer folders."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=default_out_dir,
        help="Output directory for YOLO formatted dataset (datasets/nile-red-microplastics)."
    )
    parser.add_argument("--train-ratio", type=float, default=0.70, help="Train split ratio (default: 0.70)")
    parser.add_argument("--val-ratio", type=float, default=0.20, help="Validation split ratio (default: 0.20)")
    parser.add_argument("--test-ratio", type=float, default=0.10, help="Test split ratio (default: 0.10)")
    parser.add_argument("--seed", type=int, default=42, help="Random seed for reproducible stratified split.")
    parser.add_argument(
        "--generate-synthetic",
        action="store_true",
        help="Generate synthetic fluorescence frames for validation if camera images are not yet present."
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Inspect dataset files and print split statistics without copying files."
    )

    args = parser.parse_args()
    prepare_dataset(
        annotation_dir=args.annotations,
        output_dir=args.output,
        train_ratio=args.train_ratio,
        val_ratio=args.val_ratio,
        test_ratio=args.test_ratio,
        seed=args.seed,
        generate_synthetic=args.generate_synthetic,
        dry_run=args.dry_run
    )


if __name__ == "__main__":
    main()
