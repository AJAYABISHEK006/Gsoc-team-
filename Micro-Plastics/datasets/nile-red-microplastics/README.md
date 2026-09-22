# Nile Red Stained Microplastic Fluorescence Detection Dataset

[![DOI](https://img.shields.io/badge/DOI-10.1016%2Fj.hazadv.2025.100787-blue.svg)](https://doi.org/10.1016/j.hazadv.2025.100787)
[![License: CC BY-NC-ND 4.0](https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-nd/4.0/)
[![YOLOv8 Compatible](https://img.shields.io/badge/Format-YOLOv8%20Annotations-green.svg)](https://github.com/ultralytics/ultralytics)

## Overview

This dataset supports the development of a low-cost, portable microplastic detection system integrating **Nile Red fluorescence staining** with **YOLOv8-based deep learning**. The collection comprises fluorescence images and YOLO-formatted bounding box annotations for six common microplastic polymer types captured under controlled fluorescence microscopy conditions.

### Associated Publication

> **Low-cost portable microplastic detection system integrating nile red fluorescence staining with YOLOv8-based deep learning**  
> Kittanon Rermborirak, Phutawan Nanuan, Pattarapon Komonpan, Somboon Sukpancharoen (2025).  
> *Journal of Hazardous Materials Advances*, Volume 19, 100787.  
> DOI: [10.1016/j.hazadv.2025.100787](https://doi.org/10.1016/j.hazadv.2025.100787)  
> *Open Access under Creative Commons license (CC BY-NC-ND 4.0) — freely available at ScienceDirect.*

---

## Microplastic Polymer Classes

The dataset targets six prevalent polymer types that commonly pollute terrestrial, freshwater, and marine ecosystems:

| Class ID | Polymer Code | Polymer Name | Common Industrial & Consumer Sources | Staining Response (Nile Red) |
|:---:|:---:|:---|:---|:---|
| **0** | **ABS** | Acrylonitrile Butadiene Styrene | Electronics casings, automotive components, consumer toys (LEGO) | Yellow-orange fluorescence emission |
| **1** | **Nylon** | Polyamide (PA) | Textiles, synthetic ropes, fishing nets, monofilament lines | High-intensity green/yellow emission |
| **2** | **PE** | Polyethylene (LDPE/HDPE) | Plastic bags, bottle caps, agricultural films, milk jugs | Bright yellow-golden fluorescence |
| **3** | **PET** | Polyethylene Terephthalate | Beverage bottles, synthetic polyester fibers, food containers | Moderate orange-red fluorescence |
| **4** | **PS** | Polystyrene / Expanded PS | Disposable cutlery, Styrofoam packaging, insulation boards | Intense golden-yellow fluorescence |
| **5** | **PVC** | Polyvinyl Chloride | Plumbing pipes, electrical cable insulation, synthetic flooring | Orange/reddish fluorescence emission |

---

## Dataset Annotation Statistics

The consolidated annotation set in `Alldataset_annotation/` contains **2,566 annotated image frames** across the six polymer classes:

| Class ID | Polymer Name | Annotated Frames | Target Bounding Boxes |
|:---:|:---:|:---:|:---:|
| 0 | ABS | 406 | Multi-particle labels |
| 1 | Nylon | 592 | Multi-particle labels |
| 2 | PE | 496 | Multi-particle labels |
| 3 | PET | 272 | Multi-particle labels |
| 4 | PS | 272 | Multi-particle labels |
| 5 | PVC | 528 | Multi-particle labels |
| **Total** | **6 Classes** | **2,566 frames** | **Consolidated YOLO Format** |

---

## Annotation Format

All annotations are formatted according to the standard **Ultralytics YOLO** text specification. Each image has an accompanying `.txt` file containing one line per detected particle:

```
<class_index> <x_center> <y_center> <width> <height>
```

- `<class_index>`: Integer from `0` to `5` identifying the polymer type.
- `<x_center>`: Horizontal bounding box center coordinate normalized to `[0.0, 1.0]` by image width.
- `<y_center>`: Vertical bounding box center coordinate normalized to `[0.0, 1.0]` by image height.
- `<width>`: Bounding box width normalized to `[0.0, 1.0]` by image width.
- `<height>`: Bounding box height normalized to `[0.0, 1.0]` by image height.

### Example Annotation (`ABS (1).txt`)
```
0 0.425781 0.208333 0.140625 0.268750
0 0.196484 0.200000 0.103906 0.204167
0 0.713672 0.727083 0.133594 0.156250
```

---

## Directory Structure

```
d:/Micro-Plastics/
├── Alldataset_annotation/            # Consolidated annotation files
│   ├── ABS/                          # 406 YOLO .txt annotation files
│   ├── Nylon/                        # 592 YOLO .txt annotation files
│   ├── PE/                           # 496 YOLO .txt annotation files
│   ├── PET/                          # 272 YOLO .txt annotation files
│   ├── PS/                           # 272 YOLO .txt annotation files
│   └── PVC/                          # 528 YOLO .txt annotation files
├── datasets/
│   ├── nile-red-microplastics/
│   │   ├── README.md                 # This documentation file
│   │   └── data.yaml                 # YOLOv8 dataset configuration
│   └── nasa-marine-debris/           # Satellite imagery dataset (PlanetScope)
└── ml/
    ├── README.md                     # Machine learning pipeline guide
    ├── requirements.txt              # Dependencies for model training
    └── yolov8_microplastic_detection.ipynb # Complete training, inference & export notebook
```

---

## Downloading the Raw Images

The fluorescence image archives can be obtained from the original upstream repository:

```bash
# Clone the upstream repository
git clone https://github.com/sombsuk/dataset_microplastic.git
cd dataset_microplastic

# Extract image archives (Linux / macOS)
for f in *.zip; do unzip -q "$f" -d "${f%.zip}"; done

# Or extract with PowerShell on Windows
Get-ChildItem -Filter *.zip | ForEach-Object {
    Expand-Archive -Path $_.FullName -DestinationPath $_.BaseName -Force
}
```

Then organize the images into the standard YOLO folder layout using the automated data-preparation script provided in [`ml/yolov8_microplastic_detection.ipynb`](file:///d:/Micro-Plastics/ml/yolov8_microplastic_detection.ipynb).

---

## Citation

If you use this dataset in your research or application, please cite:

```bibtex
@article{Rermborirak2025microplastic,
  title   = {Low-cost portable microplastic detection system integrating nile red fluorescence staining with YOLOv8-based deep learning},
  author  = {Rermborirak, Kittanon and Nanuan, Phutawan and Komonpan, Pattarapon and Sukpancharoen, Somboon},
  journal = {Journal of Hazardous Materials Advances},
  volume  = {19},
  pages   = {100787},
  year    = {2025},
  doi     = {10.1016/j.hazadv.2025.100787},
  url     = {https://doi.org/10.1016/j.hazadv.2025.100787}
}
```

---

## License

This dataset is distributed under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)** license.
- **You may**: Share, copy, and redistribute the material in any medium or format for non-commercial purposes with appropriate attribution.
- **You may not**: Use the material for commercial purposes, or distribute modified versions without explicit permission.
