# Machine Learning Pipeline: Microplastic Detection & Polymer Classification

This directory contains the machine learning pipelines, deep learning models, and Jupyter notebooks for training, evaluating, and deploying object detection models for microplastic identification.

---

## Architecture Overview

The detection system leverages **YOLOv8** (You Only Look Once, v8) by Ultralytics, an anchor-free single-stage object detector designed for high speed and precision, making it suitable for low-power portable edge devices.

```
       [ Fluorescence Microscopy Frame (Nile Red Stained) ]
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │        Backbone (Modified CSPDarknet)        │  <- Multi-scale feature extraction
        └──────────────────────────────────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │            Neck (PANet / FPN)                │  <- Feature pyramid aggregation
        └──────────────────────────────────────────────┘
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │             Decoupled Head                   │
        │   ┌───────────────────┬──────────────────┐   │
        │   │ Bounding Box Reg  │ Polymer Class    │   │  <- Anchor-free regression & DFL
        │   │ (CIoU + DFL Loss) │ (BCE Loss)       │   │
        │   └───────────────────┴──────────────────┘   │
        └──────────────────────────────────────────────┘
                               │
                               ▼
    [ Class ID (0-5) | Confidence | BBox Coordinates (x,y,w,h) ]
                               │
                               ▼
        ┌──────────────────────────────────────────────┐
        │        Particle Quantification Engine        │
        │  • Pixel-to-Micrometer Scale Calibration     │
        │  • Feret Diameter & Aspect Ratio Estimation  │
        │  • Size Distribution & Polymer Abundance     │
        └──────────────────────────────────────────────┘
```

---

## Key Components

### 1. [Jupyter Notebook: `yolov8_microplastic_detection.ipynb`](file:///d:/Micro-Plastics/ml/yolov8_microplastic_detection.ipynb)

A modular, end-to-end interactive notebook containing:

1. **Environment Setup & Verification**: Verifying PyTorch, GPU acceleration (CUDA), and Ultralytics installations.
2. **Exploratory Data Analysis (EDA)**:
   - Parsing the 2,566 consolidated YOLO annotation files.
   - Analyzing class balance across the 6 polymers (ABS, Nylon, PE, PET, PS, PVC).
   - Computing bounding box area distributions, aspect ratios, and particle densities per field of view.
3. **Dataset Preparation & Train/Val/Test Split**:
   - Automated creation of standard YOLO folder structure:
     ```
     datasets/nile-red-microplastics/
     ├── images/ {train, val, test}
     └── labels/ {train, val, test}
     ```
   - Stratified random splitting (e.g., 70% train, 20% val, 10% test).
   - Optional synthetic fluorescence frame generator for testing pipelines in the absence of raw TIFF/JPG images.
4. **YOLOv8 Model Configuration & Training**:
   - Initializing pretrained weights (`yolov8n.pt` for resource-constrained edge hardware, or `yolov8s.pt` for higher accuracy).
   - Specialized fluorescence hyperparameter tuning:
     - Mild color jittering (`hsv_h=0.015, hsv_s=0.5, hsv_v=0.4`) preserving Nile Red solvatochromic shift.
     - Spatial augmentations (`degrees=180.0, fliplr=0.5, flipud=0.5`) reflecting rotational invariance in microscope fields.
5. **Model Evaluation & Diagnostics**:
   - Loss curves (Box Loss, Class Loss, DFL Loss).
   - Mean Average Precision metrics: $\text{mAP}@0.5$ and $\text{mAP}@[0.5:0.95]$.
   - Confusion matrix and per-class Precision / Recall analysis.
6. **Inference & Visualization**:
   - Overlaying detected bounding boxes, class labels, and detection confidence scores.
   - Batch inference pipeline for continuous sample scanning.
7. **Quantitative Microplastic Sizing & Analysis**:
   - Converting normalized bounding box dimensions to physical units ($\mu\text{m}$) using magnification calibration factors:
     $$\text{Length}\,(\mu\text{m}) = \frac{\text{Width}_{\text{pixels}}}{\text{Scale Factor}\,(\text{pixels}/\mu\text{m})}$$
   - Generating particle size distribution histograms and polymer composition breakdown.
8. **Edge Hardware Deployment**:
   - Exporting the trained weights to **ONNX**, **OpenVINO**, and **TensorRT** for deployment on Raspberry Pi 4/5, NVIDIA Jetson Orin Nano, or Android/microcontroller edge systems.

### 2. Modular CLI Automation Scripts

For headless servers, automated batch pipelines, and edge devices, dedicated Python scripts provide direct command-line workflows:

#### **A. Dataset Preparation (`prepare_dataset.py`)**
Validates the 2,566 YOLO annotations in `Alldataset_annotation/` and produces stratified Train/Val/Test splits:
```bash
# Dry run verification
python prepare_dataset.py --dry-run

# Partition dataset and synthesize test fluorescence frames
python prepare_dataset.py --generate-synthetic
```

#### **B. Model Training (`train.py`)**
Trains YOLOv8 with fluorescence domain-specific augmentations (180° rotation invariance, restricted hue jitter):
```bash
python train.py --weights yolov8n.pt --epochs 50 --batch 16 --device 0
```

#### **C. Inference & Particle Quantification (`infer.py`)**
Detects microplastics, applies magnification calibration, and outputs physical particle statistics:
```bash
python infer.py --weights best.pt --source ../test_images/ --scale 0.65 --output-dir inference_results/
```

#### **D. Edge Hardware Export (`export.py`)**
Exports PyTorch weights for low-power edge accelerators (Raspberry Pi, Jetson Orin Nano, Intel NUC):
```bash
# Export to ONNX
python export.py --weights best.pt --format onnx --simplify

# Export to OpenVINO / TensorRT
python export.py --weights best.pt --format openvino
python export.py --weights best.pt --format engine --half
```

---

## 6 Target Polymer Classes

| ID | Class | Full Chemical Name | Expected Nile Red Fluorescence |
|:---:|:---:|:---|:---|
| `0` | **ABS** | Acrylonitrile Butadiene Styrene | Yellowish-orange emission |
| `1` | **Nylon** | Polyamide (PA) | Intense green-to-yellow emission |
| `2` | **PE** | Polyethylene (LDPE / HDPE) | Golden-yellow fluorescence |
| `3` | **PET** | Polyethylene Terephthalate | Orange-red fluorescence |
| `4` | **PS** | Polystyrene | High-intensity golden-yellow emission |
| `5` | **PVC** | Polyvinyl Chloride | Reddish-orange emission |

---

## Installation & Environment

```bash
# Create and activate a Python virtual environment (optional)
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install required packages
pip install -r requirements.txt
```

### Running the Notebook

```bash
jupyter notebook yolov8_microplastic_detection.ipynb
```
Or launch JupyterLab / open directly in VS Code / Antigravity IDE.

---

## Performance Targets (From Rermborirak et al., 2025)

In the associated publication, the YOLOv8 model demonstrated:
- High detection accuracy ($\text{mAP}@0.5 > 90\%$) across stained microplastic particles.
- Real-time inference capability (> 30 FPS on edge accelerators, < 150 ms on portable embedded CPUs).
- Successful classification even with overlapping particles and diverse particle morphologies (fibers, fragments, films, and spheres).

---

## Model Export Commands

You can also run export directly via the Ultralytics CLI or Python API:

```python
from ultralytics import YOLO

# Load trained model
model = YOLO('runs/detect/microplastic_yolov8/weights/best.pt')

# Export to ONNX (for cross-platform deployment)
model.export(format='onnx', dynamic=True, simplify=True)

# Export to OpenVINO (optimized for Intel CPUs / Raspberry Pi)
model.export(format='openvino')

# Export to TensorRT (optimized for NVIDIA Jetson)
model.export(format='engine', half=True)
```
