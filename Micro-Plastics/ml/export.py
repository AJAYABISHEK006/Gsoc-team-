#!/usr/bin/env python3
"""
Model Export for Portable Edge Devices
=======================================

This script exports trained PyTorch YOLOv8 weights (.pt) to optimized edge runtime formats:
  - ONNX (.onnx)       : Cross-platform CPU/GPU deployment (2-3x speedup)
  - OpenVINO           : Intel NUC / Raspberry Pi / VPU acceleration (3-5x speedup)
  - TensorRT (.engine) : NVIDIA Jetson Orin / Xavier / Nano (4-8x speedup)
  - TFLite (.tflite)   : ARM Edge devices, Android, Coral TPU (2-4x speedup)

Author: Micro-Plastics Research Team
License: MIT
"""

import argparse
import sys
from pathlib import Path


def export_model(
    weights: str,
    export_format: str = "onnx",
    imgsz: int = 640,
    half: bool = False,
    dynamic: bool = False,
    simplify: bool = True,
):
    try:
        from ultralytics import YOLO
    except ImportError:
        print("[!] Ultralytics is required for model export.")
        print("    Install it with: pip install ultralytics")
        sys.exit(1)

    print("=" * 65)
    print("      YOLOV8 MODEL EXPORT FOR PORTABLE EDGE HARDWARE          ")
    print("=" * 65)
    print(f"[*] Input Weights      : {weights}")
    print(f"[*] Target Format      : {export_format.upper()}")
    print(f"[*] Resolution (imgsz) : {imgsz}x{imgsz}")
    print(f"[*] FP16 Half Precision: {half}")
    print(f"[*] Dynamic Dimensions : {dynamic}")
    print(f"[*] ONNX Simplify      : {simplify}")
    print("=" * 65)

    model = YOLO(weights)

    export_kwargs = {
        "format": export_format,
        "imgsz": imgsz,
        "half": half,
        "dynamic": dynamic,
        "simplify": simplify,
    }

    try:
        output_path = model.export(**export_kwargs)
        print("\n" + "=" * 65)
        print(f"[SUCCESS] Exported model to: {output_path}")
        print("=" * 65)
        return output_path
    except Exception as e:
        print(f"\n[!] Export failed: {e}")
        if export_format == "engine":
            print("    Note: TensorRT (.engine) export requires NVIDIA GPU and TensorRT installed.")
        elif export_format == "openvino":
            print("    Note: OpenVINO export requires `pip install openvino`.")
        elif export_format == "tflite":
            print("    Note: TFLite export requires `pip install tensorflow`.")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Export YOLOv8 weights to portable edge hardware runtime formats."
    )
    parser.add_argument("--weights", type=str, required=True, help="Path to trained YOLOv8 .pt weights file.")
    parser.add_argument(
        "--format",
        type=str,
        default="onnx",
        choices=["onnx", "openvino", "engine", "tflite", "coreml", "saved_model"],
        help="Target export format (default: onnx)."
    )
    parser.add_argument("--imgsz", type=int, default=640, help="Image resolution (default: 640).")
    parser.add_argument("--half", action="store_true", help="Export with FP16 half-precision.")
    parser.add_argument("--dynamic", action="store_true", help="Enable dynamic batch and spatial dimensions for ONNX.")
    parser.add_argument("--no-simplify", action="store_true", help="Disable onnx-simplifier.")

    args = parser.parse_args()
    export_model(
        weights=args.weights,
        export_format=args.format,
        imgsz=args.imgsz,
        half=args.half,
        dynamic=args.dynamic,
        simplify=not args.no_simplify,
    )


if __name__ == "__main__":
    main()
