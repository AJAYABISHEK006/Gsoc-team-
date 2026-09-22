#!/usr/bin/env python3
"""
YOLOv8 Training Pipeline for Nile Red Microplastic Fluorescence Detection
==========================================================================

This script fine-tunes Ultralytics YOLOv8 object detection models (yolov8n, yolov8s, etc.)
on the Nile Red microplastic dataset. It incorporates specialized data augmentations
tailored for fluorescence microscopy:
  1. Full rotational invariance (degrees=180, fliplr=0.5, flipud=0.5)
  2. Solvatochromic hue preservation (hsv_h=0.015) preventing color distortion
     of polymer-specific Nile Red emission spectra.
  3. Multi-particle context via mosaic and affine scaling.

Author: Micro-Plastics Research Team
License: MIT
"""

import argparse
import os
import sys
from pathlib import Path


def find_repo_root() -> Path:
    """Locate the Micro-Plastics repository root directory."""
    cwd = Path.cwd().resolve()
    for parent in [cwd] + list(cwd.parents):
        if (parent / "datasets").is_dir() or (parent / ".git").is_dir():
            return parent
    return cwd


def train(
    data_yaml: Path,
    weights: str = "yolov8n.pt",
    epochs: int = 50,
    batch_size: int = 16,
    imgsz: int = 640,
    device: str = "",
    workers: int = 4,
    patience: int = 20,
    project: str = "microplastic_experiments",
    name: str = "yolov8n_nile_red",
    resume: bool = False,
):
    """Initializes and runs the YOLOv8 training routine."""
    try:
        import torch
        from ultralytics import YOLO
    except ImportError:
        print("[!] Ultralytics and PyTorch are required to run training.")
        print("    Install them with: pip install ultralytics torch")
        sys.exit(1)

    if not data_yaml.exists():
        print(f"[!] Dataset config not found: {data_yaml.resolve()}")
        print("    Please run `python ml/prepare_dataset.py` first to generate data.yaml and splits.")
        sys.exit(1)

    # Detect device
    if not device:
        device = "cuda" if torch.cuda.is_available() else "cpu"

    print("=" * 65)
    print("      MICROPLASTIC YOLOV8 FLUORESCENCE TRAINING PIPELINE      ")
    print("=" * 65)
    print(f"[*] Dataset Config     : {data_yaml.resolve()}")
    print(f"[*] Base Weights       : {weights}")
    print(f"[*] Epochs             : {epochs}")
    print(f"[*] Batch Size         : {batch_size}")
    print(f"[*] Image Resolution   : {imgsz}x{imgsz}")
    print(f"[*] Compute Device     : {device.upper()}")
    if device == "cuda" or (isinstance(device, str) and device.startswith("cuda")):
        print(f"[*] GPU Name           : {torch.cuda.get_device_name(0)}")
    print(f"[*] Output Directory   : {project}/{name}")
    print("=" * 65)

    # Load YOLO model
    model = YOLO(weights)

    # Train arguments with fluorescence-tailored hyperparameter augmentations
    train_args = {
        "data": str(data_yaml.resolve()).replace("\\", "/"),
        "epochs": epochs,
        "batch": batch_size,
        "imgsz": imgsz,
        "device": device,
        "workers": workers,
        "patience": patience,
        "project": project,
        "name": name,
        "exist_ok": True,
        "resume": resume,
        "verbose": True,
        # Fluorescence-specific augmentations
        "degrees": 180.0,   # Microscope slides have arbitrary rotational orientations
        "fliplr": 0.5,      # Horizontal reflection
        "flipud": 0.5,      # Vertical reflection
        "hsv_h": 0.015,     # Constrained hue shift to protect Nile Red emission wavelengths
        "hsv_s": 0.5,       # Saturation jitter
        "hsv_v": 0.4,       # Value / brightness jitter (exposure variations)
        "scale": 0.3,       # Particle scale variations
        "mosaic": 1.0,      # Multi-scale mosaic context
    }

    print("\n[*] Starting training loop...\n")
    results = model.train(**train_args)
    print("\n[+] Training completed successfully!")
    print(f"[+] Model checkpoints and metrics saved in: {project}/{name}")
    return results


def main():
    repo_root = find_repo_root()
    default_yaml = repo_root / "datasets" / "nile-red-microplastics" / "data.yaml"

    parser = argparse.ArgumentParser(
        description="Train YOLOv8 on Nile Red Microplastic Fluorescence Dataset."
    )
    parser.add_argument(
        "--data",
        type=Path,
        default=default_yaml,
        help=f"Path to dataset YAML config (default: {default_yaml})"
    )
    parser.add_argument(
        "--weights",
        type=str,
        default="yolov8n.pt",
        help="Initial model weights (e.g. yolov8n.pt, yolov8s.pt, yolov8m.pt)."
    )
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs (default: 50).")
    parser.add_argument("--batch", type=int, default=16, help="Batch size (default: 16).")
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution for training (default: 640).")
    parser.add_argument("--device", type=str, default="", help="Device: '0', '0,1', 'cpu', 'cuda' (default: auto).")
    parser.add_argument("--workers", type=int, default=4, help="DataLoader worker threads (default: 4).")
    parser.add_argument("--patience", type=int, default=20, help="Early stopping patience in epochs (default: 20).")
    parser.add_argument("--project", type=str, default="microplastic_experiments", help="Experiment project folder.")
    parser.add_argument("--name", type=str, default="yolov8n_nile_red", help="Experiment run name.")
    parser.add_argument("--resume", action="store_true", help="Resume training from last checkpoint.")

    args = parser.parse_args()
    train(
        data_yaml=args.data,
        weights=args.weights,
        epochs=args.epochs,
        batch_size=args.batch,
        imgsz=args.imgsz,
        device=args.device,
        workers=args.workers,
        patience=args.patience,
        project=args.project,
        name=args.name,
        resume=args.resume
    )


if __name__ == "__main__":
    main()
