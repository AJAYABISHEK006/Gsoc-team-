# Micro-Plastics Detection & Identification Research

An open-source research and engineering repository dedicated to automated microplastic and marine plastic debris detection, quantification, and polymer classification across satellite and fluorescence microscopy domains.

---

## Repository Overview

```
d:/Micro-Plastics/
├── .gitignore                        # Git ignore rules for ML weights, runs, and large data
├── Alldataset_annotation/            # Consolidated YOLO annotations for 6 polymer types (2,566 frames)
│   ├── ABS/                          # 406 annotation txt files
│   ├── Nylon/                        # 592 annotation txt files
│   ├── PE/                           # 496 annotation txt files
│   ├── PET/                          # 272 annotation txt files
│   ├── PS/                           # 272 annotation txt files
│   └── PVC/                          # 528 annotation txt files
├── datasets/
│   ├── nile-red-microplastics/       # Microscopic fluorescence dataset (Rermborirak et al., 2025)
│   │   ├── README.md                 # Detailed dataset documentation & polymer breakdown
│   │   └── data.yaml                 # YOLOv8 multi-class dataset configuration
│   └── nasa-marine-debris/           # Satellite imagery dataset for macro/marine debris (PlanetScope)
│       ├── README.md                 # NASA IMPACT marine debris documentation
│       ├── data.yaml                 # Satellite dataset class configuration
│       └── download_dataset.py       # Radiant MLHub download & inspection utility
└── ml/                               # Machine learning pipelines & deep learning models
    ├── README.md                     # YOLOv8 ML architecture, metrics & deployment guide
    ├── requirements.txt              # ML environment dependencies
    ├── prepare_dataset.py            # Stratified splitting and synthetic generator
    ├── train.py                      # YOLOv8 training CLI with fluorescence augmentations
    ├── infer.py                      # Inference CLI & particle sizing quantification engine
    ├── export.py                     # Edge deployment model export (ONNX/OpenVINO/TensorRT)
    └── yolov8_microplastic_detection.ipynb # Complete Jupyter Notebook for training, EDA & export
```

---

## Datasets

### 1. [Nile Red Microplastic Fluorescence Dataset](file:///d:/Micro-Plastics/datasets/nile-red-microplastics/README.md)
* **Modality**: Fluorescence microscopy under controlled excitation with Nile Red hydrophobic fluorescent dye.
* **Target Polymers (6 Classes)**:
  - `0`: **ABS** (Acrylonitrile Butadiene Styrene)
  - `1`: **Nylon** (Polyamide)
  - `2`: **PE** (Polyethylene)
  - `3`: **PET** (Polyethylene Terephthalate)
  - `4`: **PS** (Polystyrene)
  - `5`: **PVC** (Polyvinyl Chloride)
* **Annotation Format**: YOLOv8 bounding boxes (`<class> <x_center> <y_center> <width> <height>`).
* **Scale**: 2,566 annotated image frames.
* **Associated Paper**: Rermborirak et al. (2025), *Journal of Hazardous Materials Advances*, [DOI: 10.1016/j.hazadv.2025.100787](https://doi.org/10.1016/j.hazadv.2025.100787).

### 2. [NASA Marine Debris Dataset](file:///d:/Micro-Plastics/datasets/nasa-marine-debris/README.md)
* **Modality**: Optical Earth observation imagery (PlanetScope, 3m spatial resolution).
* **Target Classes**: Floating debris, plastics, algae, sargassum, wood, and artificial objects.
* **Reference**: Shah, Thomas, & Maskey (2021), Radiant MLHub, [DOI: 10.34911/rdnt.9r6ekg](https://doi.org/10.34911/rdnt.9r6ekg).

---

## Machine Learning Pipeline

The machine learning implementation resides in the [`ml/`](file:///d:/Micro-Plastics/ml/) directory:

* **Jupyter Notebook**: [`ml/yolov8_microplastic_detection.ipynb`](file:///d:/Micro-Plastics/ml/yolov8_microplastic_detection.ipynb)
  - Exploratory Data Analysis (EDA) of bounding box geometry and class distribution.
  - Automated Train / Validation / Test dataset partitioning.
  - YOLOv8 model fine-tuning with fluorescence-optimized data augmentations.
  - Evaluation curves (Confusion Matrix, Precision-Recall, mAP@50, mAP@50-95).
  - Quantitative physical particle sizing (Feret diameter and area estimation in micrometers).
  - Edge optimization and model export (ONNX, OpenVINO, TFLite).

---

## Quick Start

### 1. Install Dependencies
```bash
cd ml
pip install -r requirements.txt
```

### 2. Run the Jupyter Notebook
```bash
jupyter notebook yolov8_microplastic_detection.ipynb
```

---

## License & Attribution

- Microplastic fluorescence annotations and dataset references are distributed under [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) per Rermborirak et al. (2025).
- Machine learning code and notebooks are open-source under MIT License.