#!/usr/bin/env python3
"""
Sentinel-2 Multispectral Marine Debris & Floating Debris Index (FDI) Engine
===========================================================================
Implements Biermann et al. (2020) Floating Debris Index (FDI) and
Kikaki et al. Plastic Index (PI) across Sentinel-2 MSI multispectral bands:
  - Band 02: Blue      (490 nm, 10m)
  - Band 03: Green     (560 nm, 10m)
  - Band 04: Red       (665 nm, 10m)
  - Band 08: NIR       (842 nm, 10m)
  - Band 11: SWIR-1    (1610 nm, 20m)
  - Band 12: SWIR-2    (2190 nm, 20m)

Formula:
  FDI = R_NIR - (R_RED' + (R_SWIR1 - R_RED') * (lambda_NIR - lambda_RED) / (lambda_SWIR1 - lambda_RED) * 10)
  Or Biermann SWIR baseline formulation:
  FDI = R_NIR - [ R_RED + (R_SWIR1 - R_RED) * (lambda_NIR - lambda_RED) / (lambda_SWIR1 - lambda_RED) ]
"""

import os
import sys
import json
import argparse
import numpy as np

# Center wavelengths for Sentinel-2 MSI (nm)
LAMBDA_S2 = {
    "B02_BLUE": 492.4,
    "B03_GREEN": 559.8,
    "B04_RED": 664.6,
    "B08_NIR": 832.8,
    "B11_SWIR1": 1613.7,
    "B12_SWIR2": 2202.4,
}

class Sentinel2FDIEngine:
    """Computes spectral indices for floating marine debris and plastics."""

    def compute_fdi(self, red: float, nir: float, swir1: float) -> float:
        """
        Calculates Floating Debris Index (Biermann et al., 2020).
        """
        l_red = LAMBDA_S2["B04_RED"]
        l_nir = LAMBDA_S2["B08_NIR"]
        l_swir1 = LAMBDA_S2["B11_SWIR1"]

        # Linear baseline reflectance between Red and SWIR1 at NIR wavelength
        r_prime_nir = red + (swir1 - red) * ((l_nir - l_red) / (l_swir1 - l_red))
        fdi = nir - r_prime_nir
        return round(float(fdi), 5)

    def compute_ndvi(self, red: float, nir: float) -> float:
        """Normalized Difference Vegetation Index for distinguishing algae/sargassum."""
        denom = nir + red
        if abs(denom) < 1e-6:
            return 0.0
        return round(float((nir - red) / denom), 4)

    def compute_plastic_index(self, red: float, nir: float) -> float:
        """Kikaki Plastic Index: PI = NIR / (NIR + Red)"""
        denom = nir + red
        if abs(denom) < 1e-6:
            return 0.0
        return round(float(nir / denom), 4)

    def classify_pixel(self, red: float, nir: float, swir1: float) -> dict:
        """Classifies spectral signature into water, plastic, vegetation, or foam."""
        fdi = self.compute_fdi(red, nir, swir1)
        ndvi = self.compute_ndvi(red, nir)
        pi = self.compute_plastic_index(red, nir)

        if fdi > 0.02 and ndvi < 0.15:
            classification = "Floating Plastic Debris / Polymer Aggregation"
            confidence = min(0.96, 0.75 + fdi * 5.0)
            category = "PLASTIC"
        elif fdi > 0.02 and ndvi >= 0.15:
            classification = "Organic Marine Debris (Sargassum / Algae)"
            confidence = min(0.95, 0.70 + ndvi)
            category = "VEGETATION"
        elif nir > 0.15 and swir1 > 0.10:
            classification = "Whitecap / Wave Foam / Cloud"
            confidence = 0.88
            category = "FOAM_CLOUD"
        else:
            classification = "Clean Open Ocean Water"
            confidence = 0.99
            category = "WATER"

        return {
            "fdi": fdi,
            "ndvi": ndvi,
            "plastic_index": pi,
            "classification": classification,
            "category": category,
            "confidence": round(confidence, 3)
        }

    def generate_synthetic_scene_analysis(self, tile_id: str = "T44VNR", lat: float = 13.08, lon: float = 80.32) -> dict:
        """
        Simulates multispectral band values for a Sentinel-2 pass over coastal waters.
        """
        rng = np.random.RandomState(abs(hash(tile_id)) % 9999)
        num_anomalies = rng.randint(4, 8)
        anomalies = []

        for i in range(num_anomalies):
            is_plastic = (i % 2 == 0)
            if is_plastic:
                red = round(rng.uniform(0.015, 0.035), 4)
                nir = round(rng.uniform(0.055, 0.110), 4)
                swir1 = round(rng.uniform(0.020, 0.045), 4)
            else:
                red = round(rng.uniform(0.020, 0.040), 4)
                nir = round(rng.uniform(0.120, 0.220), 4)
                swir1 = round(rng.uniform(0.015, 0.030), 4)

            d_lat = rng.uniform(-0.08, 0.08)
            d_lon = rng.uniform(-0.08, 0.08)
            sig = self.classify_pixel(red, nir, swir1)

            anomalies.append({
                "anomaly_id": f"S2-HOTSPOT-{i+1:03d}",
                "lat": round(lat + d_lat, 5),
                "lon": round(lon + d_lon, 5),
                "bands": {"B04_RED": red, "B08_NIR": nir, "B11_SWIR1": swir1},
                "indices": {
                    "FDI": sig["fdi"],
                    "NDVI": sig["ndvi"],
                    "PI": sig["plastic_index"]
                },
                "category": sig["category"],
                "classification": sig["classification"],
                "confidence": sig["confidence"],
                "estimated_area_m2": round(rng.uniform(200, 3500), 1),
                "polymer_signature": "PE / PET / PP floating matrix" if sig["category"] == "PLASTIC" else "Natural bio-mass"
            })

        return {
            "satellite": "Sentinel-2B MSI",
            "tile_id": tile_id,
            "acquisition_date": "2026-09-08T05:22:18Z",
            "cloud_cover_percent": 3.4,
            "center_coords": {"lat": lat, "lon": lon},
            "total_anomalies_detected": len(anomalies),
            "plastic_hotspots": len([a for a in anomalies if a["category"] == "PLASTIC"]),
            "anomalies": anomalies
        }

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sentinel-2 FDI Processing Engine")
    parser.add_argument("--test", action="store_true", help="Run test analysis")
    args = parser.parse_args()

    engine = Sentinel2FDIEngine()
    res = engine.generate_synthetic_scene_analysis()
    print(json.dumps(res, indent=2))
    sys.exit(0)
