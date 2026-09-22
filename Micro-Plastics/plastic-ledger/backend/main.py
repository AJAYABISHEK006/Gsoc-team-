#!/usr/bin/env python3
"""
Plastic Ledger Python Companion Microservice Entrypoint
=======================================================
Allows running AI pipelines, SegFormer segmentation, and DeepXDE PINNs
either via CLI or as an embedded microservice.
"""

import os
import sys
import json

from config import PORT, SCALE_PIXELS_PER_MICRON, PINN_DIFFUSIVITY
from database import check_db_connection

def main():
    print("==================================================")
    print("🌊 Plastic Ledger Python AI & Remote Sensing Core")
    print(f"📡 Serving SegFormer Vision & DeepXDE PINN engine")
    print(f"🔬 Scale: {SCALE_PIXELS_PER_MICRON} px/um | Diffusivity: {PINN_DIFFUSIVITY} m2/s")
    print("==================================================")
    db_status = check_db_connection()
    print("Database Status:", json.dumps(db_status, indent=2))

if __name__ == "__main__":
    main()
