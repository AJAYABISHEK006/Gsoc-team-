#!/usr/bin/env python3
"""
Microplastic Inference & Quantitative Sizing Engine
====================================================

This script executes YOLOv8 object detection on microscope images or image folders,
and pairs detections with a physical quantification engine:
  - Magnification / pixel-to-micrometer calibration:
        Physical Size (um) = Pixel Size / Scale Factor (px/um)
  - Feret diameter (maximum particle dimension) approximation
  - Surface area estimation in um^2
  - Size categorization:
        * Fine Microplastic   : < 100 um
        * Medium Microplastic : 100 - 300 um
        * Coarse Microplastic : 300 - 1000 um
        * Large / Mesoplastic : 1000 - 5000 um (1 - 5 mm)
  - Relative polymer abundance breakdown
  - CSV report export and annotated detection visualization

Author: Micro-Plastics Research Team
License: MIT
"""

import argparse
import math
import os
import sys
from pathlib import Path

import numpy as np
import pandas as pd

CLASS_NAMES = {
    0: "ABS",
    1: "Nylon",
    2: "PE",
    3: "PET",
    4: "PS",
    5: "PVC"
}


class MicroplasticQuantifier:
    """Converts pixel bounding boxes into calibrated physical micrometer dimensions."""

    def __init__(self, pixels_per_micron: float = 0.65):
        """
        Args:
            pixels_per_micron: Camera/lens calibration scale factor.
                Example: at 10x objective magnification with standard sensor,
                1 micrometer equates to ~0.5 to 1.2 pixels.
        """
        self.scale = max(1e-6, pixels_per_micron)

    def quantify(self, class_id: int, w_pixels: float, h_pixels: float, conf: float = 1.0) -> dict:
        w_um = w_pixels / self.scale
        h_um = h_pixels / self.scale
        feret_max_um = max(w_um, h_um)
        feret_min_um = min(w_um, h_um)
        aspect_ratio = feret_max_um / max(1e-6, feret_min_um)
        area_um2 = math.pi * (w_um / 2.0) * (h_um / 2.0)

        # Standard marine biology size classification
        if feret_max_um < 100:
            size_category = "< 100 um (Fine Microplastic)"
        elif feret_max_um < 300:
            size_category = "100 - 300 um (Medium Microplastic)"
        elif feret_max_um < 1000:
            size_category = "300 - 1000 um (Coarse Microplastic)"
        else:
            size_category = "1 - 5 mm (Large Microplastic)"

        return {
            "class_id": class_id,
            "polymer": CLASS_NAMES.get(class_id, f"Class_{class_id}"),
            "confidence": conf,
            "width_px": round(w_pixels, 1),
            "height_px": round(h_pixels, 1),
            "width_um": round(w_um, 2),
            "height_um": round(h_um, 2),
            "feret_max_um": round(feret_max_um, 2),
            "area_um2": round(area_um2, 2),
            "aspect_ratio": round(aspect_ratio, 2),
            "size_category": size_category,
        }


def run_inference(
    weights: str,
    source: Path,
    output_dir: Path,
    conf_thresh: float = 0.25,
    iou_thresh: float = 0.45,
    imgsz: int = 640,
    device: str = "",
    scale: float = 0.65,
    save_plots: bool = True,
    export_csv: bool = True,
):
    try:
        from ultralytics import YOLO
        import cv2
    except ImportError:
        print("[!] Ultralytics and OpenCV are required for inference.")
        print("    Install them with: pip install ultralytics opencv-python")
        sys.exit(1)

    output_dir.mkdir(parents=True, exist_ok=True)
    quantifier = MicroplasticQuantifier(pixels_per_micron=scale)

    print("=" * 65)
    print("      MICROPLASTIC INFERENCE & QUANTITATIVE SIZING ENGINE     ")
    print("=" * 65)
    print(f"[*] Weights            : {weights}")
    print(f"[*] Source             : {source.resolve()}")
    print(f"[*] Confidence Cutoff  : {conf_thresh:.2f}")
    print(f"[*] Calibration Scale  : {scale:.3f} px / um")
    print(f"[*] Output Directory   : {output_dir.resolve()}")
    print("=" * 65)

    model = YOLO(weights)

    # Collect source files
    if source.is_dir():
        image_paths = sorted(
            [p for p in source.glob("*.*") if p.suffix.lower() in [".jpg", ".jpeg", ".png", ".tif", ".tiff"]]
        )
    elif source.is_file():
        image_paths = [source]
    else:
        print(f"[!] Invalid source path: {source}")
        sys.exit(1)

    if not image_paths:
        print(f"[!] No valid image files found in {source}")
        sys.exit(1)

    print(f"[*] Processing {len(image_paths)} images...\n")

    all_detections = []

    for img_idx, img_path in enumerate(image_paths, 1):
        results = model.predict(
            source=str(img_path),
            conf=conf_thresh,
            iou=iou_thresh,
            imgsz=imgsz,
            device=device if device else None,
            verbose=False,
        )

        res = results[0]
        boxes = res.boxes
        num_dets = len(boxes) if boxes is not None else 0
        print(f"[{img_idx}/{len(image_paths)}] {img_path.name} -> {num_dets} particle(s) detected")

        frame_dets = []
        if boxes is not None and num_dets > 0:
            for b in boxes:
                cid = int(b.cls[0].item())
                cf = float(b.conf[0].item())
                xyxy = b.xyxy[0].tolist()
                w_px = xyxy[2] - xyxy[0]
                h_px = xyxy[3] - xyxy[1]

                info = quantifier.quantify(class_id=cid, w_pixels=w_px, h_pixels=h_px, conf=cf)
                info["image"] = img_path.name
                info["bbox_xyxy"] = [round(v, 1) for v in xyxy]
                frame_dets.append(info)
                all_detections.append(info)

        # Save annotated image
        if save_plots:
            annotated_img = res.plot(line_width=2, font_size=1)
            out_img_path = output_dir / f"det_{img_path.name}"
            cv2.imwrite(str(out_img_path), annotated_img)

    # Summarize & Export
    if all_detections:
        df = pd.DataFrame(all_detections)
        print("\n" + "=" * 65)
        print("                 QUANTITATIVE SUMMARY REPORT                 ")
        print("=" * 65)
        print(f"Total Particles Detected : {len(df):,}")
        print("\nPolymer Breakdown:")
        print(df["polymer"].value_counts().to_string())
        print("\nSize Category Distribution:")
        print(df["size_category"].value_counts().to_string())
        print("\nPhysical Size Statistics (um):")
        print(df[["feret_max_um", "area_um2", "aspect_ratio"]].describe().to_string())

        if export_csv:
            csv_path = output_dir / "microplastic_quantification_report.csv"
            df.to_csv(csv_path, index=False)
            print(f"\n[+] Exported CSV report to: {csv_path.resolve()}")
    else:
        print("\n[INFO] No particles were detected matching confidence threshold.")

    print(f"[+] All outputs saved to: {output_dir.resolve()}")


def main():
    parser = argparse.ArgumentParser(
        description="Run YOLOv8 inference and physical particle quantification."
    )
    parser.add_argument("--weights", type=str, default="yolov8n.pt", help="Path to trained YOLO weights (.pt).")
    parser.add_argument("--source", type=Path, required=True, help="Path to single image or folder of images.")
    parser.add_argument("--conf", type=float, default=0.25, help="Confidence threshold (default: 0.25).")
    parser.add_argument("--iou", type=float, default=0.45, help="NMS IoU threshold (default: 0.45).")
    parser.add_argument("--imgsz", type=int, default=640, help="Inference resolution (default: 640).")
    parser.add_argument("--device", type=str, default="", help="Device: 'cpu', 'cuda', '0' (default: auto).")
    parser.add_argument(
        "--scale",
        type=float,
        default=0.65,
        help="Calibration scale factor in pixels per micrometer (default: 0.65 px/um)."
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("inference_results"),
        help="Directory to save annotated images and reports."
    )
    parser.add_argument("--no-plots", action="store_true", help="Disable saving annotated images.")
    parser.add_argument("--no-csv", action="store_true", help="Disable CSV report export.")

    args = parser.parse_args()
    run_inference(
        weights=args.weights,
        source=args.source,
        output_dir=args.output_dir,
        conf_thresh=args.conf,
        iou_thresh=args.iou,
        imgsz=args.imgsz,
        device=args.device,
        scale=args.scale,
        save_plots=not args.no_plots,
        export_csv=not args.no_csv,
    )


if __name__ == "__main__":
    main()
