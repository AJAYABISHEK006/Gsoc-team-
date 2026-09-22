#!/usr/bin/env python3
"""
NASA IMPACT Marine Debris Dataset Downloader & Staging Utility
==============================================================

This script facilitates fetching the PlanetScope satellite marine debris imagery
and bounding box annotations from Radiant MLHub / NASA IMPACT:
    DOI: 10.34911/rdnt.9r6ekg
    GitHub: https://github.com/NASA-IMPACT/marine_debris_ML

Dataset Modality:
  - 3-meter spatial resolution optical imagery (PlanetScope 4-band / RGB)
  - 256x256 image tiles covering coastal zones in Honduras, Ghana, and Greece.
  - Classes: Plastics, Algae, Sargassum, Wood, Artificial Items.

Usage:
  python download_dataset.py --api-key YOUR_RADIANT_MLHUB_API_KEY
  python download_dataset.py --info

Author: Micro-Plastics Research Team
License: MIT
"""

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

COLLECTION_ID = "nasa_marine_debris"
DOI = "10.34911/rdnt.9r6ekg"
DOCUMENTATION_URL = "https://radiantearth.blob.core.windows.net/mlhub/nasa-marine-debris/documentation.pdf"
GITHUB_URL = "https://github.com/NASA-IMPACT/marine_debris_ML"


def print_dataset_info():
    """Prints comprehensive metadata about the NASA Marine Debris dataset."""
    info = f"""
==============================================================================
    NASA IMPACT Marine Debris Dataset (PlanetScope Satellite Imagery)
==============================================================================
Collection ID  : {COLLECTION_ID}
DOI            : {DOI}
License        : CC-BY-NC-4.0
Documentation  : {DOCUMENTATION_URL}
Code Repository: {GITHUB_URL}

Sensor Details:
  - Platform   : PlanetScope Dove Satellites (Planet Labs PBC)
  - Bands      : 4-band multispectral (Blue, Green, Red, Near-Infrared) & RGB
  - Resolution : ~3.0 meters Ground Sample Distance (GSD)
  - Tile Size  : 256 x 256 pixels

Target Classes:
  0: Plastics
  1: Algae
  2: Sargassum
  3: Wood
  4: Artificial Items

Geographic Coverage:
  - Bay Islands (Roatan, Guanaja, Utila), Honduras
  - Accra & coastal regions, Ghana
  - Aegean Sea & Mediterranean coastlines, Greece

How to Download:
  1. Register for a free Radiant MLHub API key at: https://mlhub.earth/
  2. Install the Radiant MLHub client:
         pip install radiant-mlhub
  3. Execute download:
         python download_dataset.py --api-key <YOUR_API_KEY>
==============================================================================
"""
    print(info)


def download_with_api_key(api_key: str, output_dir: Path):
    """Downloads dataset using radiant_mlhub client library."""
    try:
        from radiant_mlhub import Dataset
    except ImportError:
        print("[!] The `radiant-mlhub` library is required to download via API key.")
        print("    Install it via: pip install radiant-mlhub")
        sys.exit(1)

    os.environ["MLHUB_API_KEY"] = api_key
    print(f"[*] Connecting to Radiant MLHub with API key...")
    try:
        ds = Dataset.fetch(COLLECTION_ID)
        print(f"[+] Found dataset: {ds.id} ({ds.title})")
        print(f"[*] Downloading archives to: {output_dir.resolve()}...")
        output_dir.mkdir(parents=True, exist_ok=True)
        ds.download(output_dir=str(output_dir))
        print("[+] Download complete!")
    except Exception as e:
        print(f"[!] Download failed: {e}")
        sys.exit(1)


def main():
    parser = argparse.ArgumentParser(
        description="Download and inspect the NASA Marine Debris satellite dataset."
    )
    parser.add_argument(
        "--info",
        action="store_true",
        help="Print dataset metadata, sensor specs, and class definitions."
    )
    parser.add_argument(
        "--api-key",
        type=str,
        default="",
        help="Radiant MLHub API Key for automated archive downloading."
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path(__file__).parent / "data",
        help="Destination directory for downloaded satellite data tiles."
    )

    args = parser.parse_args()

    if args.info or not args.api_key:
        print_dataset_info()
        if not args.api_key and not args.info:
            print("Tip: Provide `--api-key <KEY>` to start automated download, or `--info` for details.")
    else:
        download_with_api_key(api_key=args.api_key, output_dir=args.output_dir)


if __name__ == "__main__":
    main()
