import json
from pathlib import Path

def create_notebook():
    notebook = {
        "cells": [],
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3 (ipykernel)",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {
                    "name": "ipython",
                    "version": 3
                },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.12.0"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 4
    }

    def add_cell(cell_type, source_text):
        lines = [line + "\n" for line in source_text.split("\n")]
        if lines and lines[-1] == "\n":
            lines[-1] = ""
        cell = {
            "cell_type": cell_type,
            "metadata": {},
            "source": lines
        }
        if cell_type == "code":
            cell["execution_count"] = None
            cell["outputs"] = []
        notebook["cells"].append(cell)

    # -------------------------------------------------------------
    # CELL 1: Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """# Microplastic Detection & Polymer Classification using YOLOv8
### Portable Nile Red Fluorescence Detection System

This notebook implements an end-to-end Deep Learning pipeline for identifying, classifying, and quantifying microplastic particles across **six major polymer types** using **Nile Red fluorescence imaging** and **YOLOv8**.

#### Associated Publication
> **Low-cost portable microplastic detection system integrating nile red fluorescence staining with YOLOv8-based deep learning**  
> Kittanon Rermborirak, Phutawan Nanuan, Pattarapon Komonpan, Somboon Sukpancharoen (2025).  
> *Journal of Hazardous Materials Advances*, 19, 100787. [DOI: 10.1016/j.hazadv.2025.100787](https://doi.org/10.1016/j.hazadv.2025.100787)

#### Target Polymer Classes:
* **0: ABS** (Acrylonitrile Butadiene Styrene)
* **1: Nylon** (Polyamide)
* **2: PE** (Polyethylene)
* **3: PET** (Polyethylene Terephthalate)
* **4: PS** (Polystyrene)
* **5: PVC** (Polyvinyl Chloride)

---
### Pipeline Overview:
1. **Environment Setup & Verification**: PyTorch, GPU detection, and Ultralytics.
2. **Exploratory Data Analysis (EDA)**: Parsing 2,566 YOLO annotations, analyzing class balance, particle counts, and bbox geometry.
3. **Dataset Structuring & Splitting**: Stratified 70/20/10 train/val/test partitioning.
4. **Dataset Configuration**: Ultralytics `data.yaml` verification.
5. **Model Training**: Transfer learning with YOLOv8 using fluorescence-specific data augmentations.
6. **Performance Evaluation**: Loss curves, confusion matrix, and mAP@0.5 / mAP@0.5:0.95.
7. **Inference & Visualization**: Qualitative bounding box detection and class classification overlays.
8. **Quantitative Sizing Engine**: Pixel-to-micrometer calibration, Feret diameter calculation, and size distribution histograms.
9. **Edge Hardware Export**: Exporting weights to ONNX, OpenVINO, and TensorRT for portable field deployment.""")

    # -------------------------------------------------------------
    # CELL 2: Environment Setup / Code
    # -------------------------------------------------------------
    add_cell("code", """# ==============================================================================
# 1. Environment Setup & Dependency Verification
# ==============================================================================
import os
import sys
import glob
import math
import random
import shutil
from pathlib import Path

# Core Data Science & CV
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import cv2
from PIL import Image
import yaml

# Deep Learning Framework
import torch
import torchvision

# YOLO Framework
try:
    import ultralytics
    from ultralytics import YOLO
    print(f"[OK] Ultralytics YOLOv8 Version: {ultralytics.__version__}")
except ImportError:
    print("[!] Ultralytics not found. Installing via pip...")
    # !pip install ultralytics
    import ultralytics
    from ultralytics import YOLO

# Hardware Acceleration Check
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[OK] PyTorch Version: {torch.__version__}")
print(f"[OK] Compute Device: {device.upper()}")
if device == "cuda":
    print(f"     GPU Model: {torch.cuda.get_device_name(0)}")
    print(f"     VRAM Available: {torch.cuda.get_device_properties(0).total_memory / (1024**3):.2f} GB")

# Set random seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
torch.manual_seed(SEED)
if torch.cuda.is_available():
    torch.cuda.manual_seed_all(SEED)""")

    # -------------------------------------------------------------
    # CELL 3: EDA Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 2. Exploratory Data Analysis (EDA) of Annotation Files

The repository contains **2,566 consolidated YOLO annotation text files** located in `Alldataset_annotation/` partitioned by polymer directory:
- `ABS/` (Class 0)
- `Nylon/` (Class 1)
- `PE/` (Class 2)
- `PET/` (Class 3)
- `PS/` (Class 4)
- `PVC/` (Class 5)

Each line in a YOLO annotation file follows:
$$\\text{class\\_id} \\quad x_{\\text{center}} \\quad y_{\\text{center}} \\quad w \\quad h$$
where all coordinates are normalized between $0.0$ and $1.0$ relative to image dimensions.""")

    # -------------------------------------------------------------
    # CELL 4: Parse Annotations / Code
    # -------------------------------------------------------------
    add_cell("code", """# Define class mapping dictionary
CLASS_NAMES = {
    0: "ABS",
    1: "Nylon",
    2: "PE",
    3: "PET",
    4: "PS",
    5: "PVC"
}

# Locate annotation directory
REPO_ROOT = Path("..") if Path("..").resolve().name == "Micro-Plastics" else Path(".")
ANNOTATION_DIR = REPO_ROOT / "Alldataset_annotation"

if not ANNOTATION_DIR.exists():
    # Try alternative search
    matches = list(Path(".").glob("**/Alldataset_annotation"))
    if matches:
        ANNOTATION_DIR = matches[0]

print(f"Annotation Directory: {ANNOTATION_DIR.resolve()}")

# Parse all annotation files
records = []
file_stats = []

for class_id, class_name in CLASS_NAMES.items():
    class_folder = ANNOTATION_DIR / class_name
    if not class_folder.exists():
        continue
    
    txt_files = list(class_folder.glob("*.txt"))
    for txt_file in txt_files:
        p_count = 0
        with open(txt_file, "r") as f:
            for line in f:
                parts = line.strip().split()
                if len(parts) >= 5:
                    cid = int(parts[0])
                    xc, yc, w, h = map(float, parts[1:5])
                    area = w * h
                    aspect_ratio = w / h if h > 0 else 0
                    records.append({
                        "filename": txt_file.name,
                        "class_id": cid,
                        "class_name": CLASS_NAMES.get(cid, str(cid)),
                        "x_center": xc,
                        "y_center": yc,
                        "width": w,
                        "height": h,
                        "area": area,
                        "aspect_ratio": aspect_ratio
                    })
                    p_count += 1
        file_stats.append({
            "filename": txt_file.name,
            "folder_class": class_name,
            "class_id": class_id,
            "particle_count": p_count
        })

df_boxes = pd.DataFrame(records)
df_files = pd.DataFrame(file_stats)

print(f"Total Annotated Frames: {len(df_files):,}")
print(f"Total Detected Microplastic Particles (Bounding Boxes): {len(df_boxes):,}")
print("\\n--- Frames Per Polymer Class ---")
print(df_files["folder_class"].value_counts().to_string())
print("\\n--- Bounding Boxes Per Polymer Class ---")
print(df_boxes["class_name"].value_counts().to_string())
df_boxes.head()""")

    # -------------------------------------------------------------
    # CELL 5: EDA Visualizations / Code
    # -------------------------------------------------------------
    add_cell("code", """# Set visual style
sns.set_theme(style="whitegrid", palette="deep")
fig = plt.figure(figsize=(18, 12))
plt.subplots_adjust(hspace=0.35, wspace=0.3)

# 1. Class Distribution (Image Frames & Particles)
ax1 = plt.subplot(2, 3, 1)
palette = ["#e74c3c", "#3498db", "#2ecc71", "#9b59b6", "#f39c12", "#1abc9c"]
class_counts = df_files["folder_class"].value_counts()[["ABS", "Nylon", "PE", "PET", "PS", "PVC"]]
bars = ax1.bar(class_counts.index, class_counts.values, color=palette, edgecolor="black", alpha=0.85)
ax1.set_title("Dataset Distribution: Frames per Polymer", fontsize=12, fontweight="bold")
ax1.set_ylabel("Number of Frames")
ax1.set_xlabel("Polymer Type")
for bar in bars:
    yval = bar.get_height()
    ax1.text(bar.get_x() + bar.get_width()/2.0, yval + 10, f"{int(yval)}", ha="center", va="bottom", fontsize=10)

# 2. Particles per Image Distribution
ax2 = plt.subplot(2, 3, 2)
sns.histplot(df_files["particle_count"], bins=20, kde=True, color="#2980b9", ax=ax2)
ax2.set_title("Particle Density: Particles per Frame", fontsize=12, fontweight="bold")
ax2.set_xlabel("Particles / Frame")
ax2.set_ylabel("Frequency")

# 3. Bounding Box Normalized Width & Height Distribution
ax3 = plt.subplot(2, 3, 3)
sns.histplot(df_boxes["width"], color="#e67e22", kde=True, label="Width", stat="density", alpha=0.5, ax=ax3)
sns.histplot(df_boxes["height"], color="#27ae60", kde=True, label="Height", stat="density", alpha=0.5, ax=ax3)
ax3.set_title("Bounding Box Dimensions (Normalized)", fontsize=12, fontweight="bold")
ax3.set_xlabel("Normalized Dimension (0 to 1)")
ax3.legend()

# 4. Aspect Ratio Distribution (Width / Height)
ax4 = plt.subplot(2, 3, 4)
sns.boxplot(data=df_boxes, x="class_name", y="aspect_ratio", palette=palette, ax=ax4, showfliers=False)
ax4.set_title("Aspect Ratio (W / H) across Polymers", fontsize=12, fontweight="bold")
ax4.set_xlabel("Polymer Type")
ax4.set_ylabel("Aspect Ratio")
ax4.axhline(1.0, color="gray", linestyle="--", alpha=0.7)

# 5. Spatial Distribution Heatmap (Normalized Centers)
ax5 = plt.subplot(2, 3, 5)
h = ax5.hexbin(df_boxes["x_center"], df_boxes["y_center"], gridsize=30, cmap="inferno", mincnt=1)
ax5.set_title("Spatial Center Density in Field of View", fontsize=12, fontweight="bold")
ax5.set_xlabel("X Center")
ax5.set_ylabel("Y Center")
ax5.set_xlim(0, 1)
ax5.set_ylim(0, 1)
ax5.invert_yaxis()
fig.colorbar(h, ax=ax5, label="Particle Count")

# 6. Normalized Area by Polymer Type
ax6 = plt.subplot(2, 3, 6)
sns.boxplot(data=df_boxes, x="class_name", y="area", palette=palette, ax=ax6, showfliers=False)
ax6.set_title("Bounding Box Area (Norm) across Polymers", fontsize=12, fontweight="bold")
ax6.set_xlabel("Polymer Type")
ax6.set_ylabel("Normalized Area (W * H)")

plt.suptitle("Exploratory Data Analysis: Nile Red Microplastics YOLO Dataset", fontsize=16, fontweight="bold", y=0.98)
plt.show()""")

    # -------------------------------------------------------------
    # CELL 6: Dataset Split Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 3. Dataset Preparation & Stratified Train/Val/Test Split

To train YOLOv8, datasets must follow standard Ultralytics hierarchy:
```
datasets/nile-red-microplastics/
├── images/
│   ├── train/
│   ├── val/
│   └── test/
└── labels/
    ├── train/
    ├── val/
    └── test/
```

We perform a **stratified random split** (70% Train, 20% Validation, 10% Test) grouped by class to ensure proportional representation of all 6 polymer types.

> **Note on Fluorescence Images**:  
> In laboratory deployment, raw microscope camera frames (`.jpg` or `.png`) pair with these labels by matching base filenames (e.g. `ABS_001.jpg` <-> `ABS_001.txt`).  
> Below, we also provide a synthetic fluorescence generator to synthesize testing frames with characteristic fluorescence emission colors if raw images are still downloading.""")

    # -------------------------------------------------------------
    # CELL 7: Dataset Split Script / Code
    # -------------------------------------------------------------
    add_cell("code", """# Define destination paths for YOLO structure
YOLO_DATA_ROOT = REPO_ROOT / "datasets" / "nile-red-microplastics"
IMAGES_DIR = YOLO_DATA_ROOT / "images"
LABELS_DIR = YOLO_DATA_ROOT / "labels"

SPLITS = ["train", "val", "test"]
SPLIT_RATIOS = {"train": 0.70, "val": 0.20, "test": 0.10}

for split in SPLITS:
    (IMAGES_DIR / split).mkdir(parents=True, exist_ok=True)
    (LABELS_DIR / split).mkdir(parents=True, exist_ok=True)

print(f"YOLO Dataset Structure Initialized at: {YOLO_DATA_ROOT.resolve()}")

# Perform stratified partitioning across all 6 polymer folders
split_summary = {"train": 0, "val": 0, "test": 0}
per_class_summary = {c: {"train": 0, "val": 0, "test": 0} for c in CLASS_NAMES.values()}

for class_id, class_name in CLASS_NAMES.items():
    class_folder = ANNOTATION_DIR / class_name
    if not class_folder.exists():
        continue
    
    files = sorted(list(class_folder.glob("*.txt")))
    random.seed(SEED + class_id)
    random.shuffle(files)
    
    n_total = len(files)
    n_train = int(n_total * SPLIT_RATIOS["train"])
    n_val = int(n_total * SPLIT_RATIOS["val"])
    
    partition = {
        "train": files[:n_train],
        "val": files[n_train:n_train + n_val],
        "test": files[n_train + n_val:]
    }
    
    for split_name, split_files in partition.items():
        for txt_path in split_files:
            dest_label = LABELS_DIR / split_name / txt_path.name
            shutil.copy2(txt_path, dest_label)
            split_summary[split_name] += 1
            per_class_summary[class_name][split_name] += 1

print("\\n--- Stratified Split Summary ---")
df_split = pd.DataFrame(per_class_summary).T
df_split["Total"] = df_split.sum(axis=1)
print(df_split.to_string())
print(f"\\nTotal Samples Partitioned: {sum(split_summary.values())}")""")

    # -------------------------------------------------------------
    # CELL 8: Synthetic Frame Generator / Code
    # -------------------------------------------------------------
    add_cell("code", """def generate_synthetic_fluorescence_frame(txt_label_path, img_size=(640, 640)):
    \"\"\"
    Generates a realistic fluorescence microscopy image matching YOLO annotations.
    Useful for pipeline validation and unit testing prior to acquiring hardware camera frames.
    
    Colors are mapped according to Nile Red solvatochromic emission spectra:
    - ABS: Yellow-orange emission (RGB ~ [255, 170, 30])
    - Nylon: Bright green-yellow emission (RGB ~ [180, 255, 40])
    - PE: Golden yellow emission (RGB ~ [240, 220, 50])
    - PET: Red-orange emission (RGB ~ [255, 90, 40])
    - PS: High-intensity golden emission (RGB ~ [255, 230, 80])
    - PVC: Deep orange-red emission (RGB ~ [240, 60, 30])
    \"\"\"
    W, H = img_size
    # Dark background with mild sensor noise
    img = np.random.normal(12, 4, (H, W, 3)).clip(0, 40).astype(np.uint8)
    
    COLOR_MAP = {
        0: (30, 170, 255),   # ABS (BGR for OpenCV)
        1: (40, 255, 180),   # Nylon
        2: (50, 220, 240),   # PE
        3: (40, 90, 255),    # PET
        4: (80, 230, 255),   # PS
        5: (30, 60, 240),    # PVC
    }
    
    if not os.path.exists(txt_label_path):
        return img
    
    with open(txt_label_path, "r") as f:
        for line in f:
            parts = line.strip().split()
            if len(parts) >= 5:
                cid = int(parts[0])
                xc, yc, w, h = map(float, parts[1:5])
                
                # Convert normalized to pixel coordinates
                px_x = int(xc * W)
                px_y = int(yc * H)
                px_w = max(4, int(w * W))
                px_h = max(4, int(h * H))
                
                color = COLOR_MAP.get(cid, (200, 200, 200))
                
                # Render particle with Gaussian fluorescence glow
                axes = (max(2, px_w // 2), max(2, px_h // 2))
                angle = random.randint(0, 180)
                # Outer glow
                cv2.ellipse(img, (px_x, px_y), (axes[0] + 3, axes[1] + 3), angle, 0, 360, tuple(c // 2 for c in color), -1)
                # Intense core
                cv2.ellipse(img, (px_x, px_y), axes, angle, 0, 360, color, -1)
                
    # Add slight Gaussian blur to simulate microscope point spread function (PSF)
    img = cv2.GaussianBlur(img, (3, 3), 0)
    return img

# Check if images directory has images; if not, generate matching test frames
existing_images = list(IMAGES_DIR.glob("**/*.jpg")) + list(IMAGES_DIR.glob("**/*.png"))
if len(existing_images) == 0:
    print("[INFO] No camera frames found in images/. Generating synthetic fluorescence frames for validation...")
    for split in SPLITS:
        lbl_files = list((LABELS_DIR / split).glob("*.txt"))
        # Generate for split samples
        for lbl_path in lbl_files:
            syn_img = generate_synthetic_fluorescence_frame(lbl_path)
            img_dest = IMAGES_DIR / split / f"{lbl_path.stem}.jpg"
            cv2.imwrite(str(img_dest), syn_img)
    print(f"[OK] Generated matching synthetic fluorescence images in {IMAGES_DIR.resolve()}")
else:
    print(f"[OK] Found {len(existing_images)} existing camera images.")""")

    # -------------------------------------------------------------
    # CELL 9: YOLO Configuration Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 4. YOLOv8 Configuration (`data.yaml`)

Ultralytics YOLO requires a dataset definition YAML file mapping image paths and class identities.""")

    # -------------------------------------------------------------
    # CELL 10: Check data.yaml / Code
    # -------------------------------------------------------------
    add_cell("code", """DATA_YAML_PATH = YOLO_DATA_ROOT / "data.yaml"

yaml_content = {
    "path": str(YOLO_DATA_ROOT.resolve()).replace("\\\\", "/"),
    "train": "images/train",
    "val": "images/val",
    "test": "images/test",
    "names": {cid: name for cid, name in CLASS_NAMES.items()}
}

with open(DATA_YAML_PATH, "w") as f:
    yaml.dump(yaml_content, f, sort_keys=False)

print(f"[OK] Wrote data.yaml to: {DATA_YAML_PATH.resolve()}\\n")
with open(DATA_YAML_PATH, "r") as f:
    print(f.read())""")

    # -------------------------------------------------------------
    # CELL 11: Model Training Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 5. YOLOv8 Model Training

### Model Selection
For portable and low-power microplastic detection hardware (such as Raspberry Pi 5 or NVIDIA Jetson Nano), **YOLOv8n (Nano)** or **YOLOv8s (Small)** provides the optimal balance of high mAP and low latency:
- **`yolov8n.pt`**: 3.2M parameters, ~8.7 GFLOPs (ideal for microcontrollers & 30+ FPS edge inference).
- **`yolov8s.pt`**: 11.2M parameters, ~28.6 GFLOPs (higher detection accuracy for dense particles).

### Domain-Specific Augmentation Strategy
Under fluorescence microscopy:
1. **Rotational Invariance (`degrees=180.0, fliplr=0.5, flipud=0.5`)**: Particles exhibit no preferred physical orientation on the filter membrane.
2. **Constrained Color Jitter (`hsv_h=0.015, hsv_s=0.5, hsv_v=0.4`)**: Microplastic polymer identification relies heavily on Nile Red's solvatochromic emission spectrum. Heavy hue alterations must be avoided.""")

    # -------------------------------------------------------------
    # CELL 12: Train Model / Code
    # -------------------------------------------------------------
    add_cell("code", """# Initialize YOLOv8 Model
MODEL_WEIGHTS = "yolov8n.pt"  # Can also be 'yolov8s.pt' or 'yolov8m.pt'
model = YOLO(MODEL_WEIGHTS)

print(f"Loaded pretrained backbone: {MODEL_WEIGHTS}")

# Training Parameters
EPOCHS = 50          # Recommended: 50 - 100 epochs for full convergence
BATCH_SIZE = 16      # Adjust according to available VRAM (8, 16, 32)
IMG_SIZE = 640       # Standard resolution

train_args = dict(
    data=str(DATA_YAML_PATH.resolve()).replace("\\\\", "/"),
    epochs=EPOCHS,
    batch=BATCH_SIZE,
    imgsz=IMG_SIZE,
    device=device,
    workers=4,
    seed=SEED,
    # Fluorescence-specific augmentations
    degrees=180.0,    # Full rotational invariance
    fliplr=0.5,       # Horizontal flip
    flipud=0.5,       # Vertical flip
    hsv_h=0.015,      # Restrict hue jitter to preserve emission color
    hsv_s=0.5,        # Saturation jitter
    hsv_v=0.4,        # Brightness jitter
    scale=0.3,        # Scale jitter (0.7x to 1.3x)
    mosaic=1.0,       # Mosaic augmentation for multi-particle context
    project="microplastic_experiments",
    name="yolov8n_nile_red",
    exist_ok=True,
    verbose=True
)

print("\\nReady to train. Run `model.train(**train_args)` to start fine-tuning.")
# Uncomment to execute training:
# results = model.train(**train_args)""")

    # -------------------------------------------------------------
    # CELL 13: Evaluation Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 6. Model Evaluation & Performance Metrics

Ultralytics computes rigorous object detection evaluation metrics:
- **Precision ($P$)**: $\\frac{TP}{TP + FP}$
- **Recall ($R$)**: $\\frac{TP}{TP + FN}$
- **$\\text{mAP}@0.5$**: Mean Average Precision at IoU threshold $0.50$
- **$\\text{mAP}@[0.5:0.95]$**: Average mAP across IoU thresholds from $0.50$ to $0.95$ in steps of $0.05$""")

    # -------------------------------------------------------------
    # CELL 14: Evaluation Script / Code
    # -------------------------------------------------------------
    add_cell("code", """def evaluate_model(trained_model, data_yaml_path):
    \"\"\"
    Evaluates the model on the held-out test split and displays per-class performance metrics.
    \"\"\"
    metrics = trained_model.val(data=str(data_yaml_path), split="test")
    
    print("\\n========================================================")
    print("           TEST EVALUATION RESULTS (mAP)                ")
    print("========================================================")
    print(f"Overall mAP@0.5      : {metrics.box.map50:.4f}")
    print(f"Overall mAP@0.5:0.95 : {metrics.box.map:.4f}")
    print(f"Mean Precision       : {metrics.box.mp:.4f}")
    print(f"Mean Recall          : {metrics.box.mr:.4f}")
    print("--------------------------------------------------------")
    
    # Class-wise metrics
    for idx, name in CLASS_NAMES.items():
        if idx < len(metrics.box.ap50):
            print(f"[{name:<6}] AP@0.5: {metrics.box.ap50[idx]:.4f} | AP@0.5:0.95: {metrics.box.ap[idx]:.4f}")
            
    return metrics

# Example usage when a checkpoint is available:
# metrics = evaluate_model(model, DATA_YAML_PATH)""")

    # -------------------------------------------------------------
    # CELL 15: Inference Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 7. Inference & Visualization Pipeline

Visualizing detection results with bounding boxes, confidence probabilities, and polymer classification labels.""")

    # -------------------------------------------------------------
    # CELL 16: Inference Code / Code
    # -------------------------------------------------------------
    add_cell("code", """def run_inference_and_plot(model, image_path, conf_threshold=0.25):
    \"\"\"
    Runs detection on a test image and displays the annotated image.
    \"\"\"
    results = model.predict(source=str(image_path), conf=conf_threshold, save=False, verbose=False)
    res = results[0]
    
    # Plot detections
    annotated_bgr = res.plot(line_width=2, font_size=1)
    annotated_rgb = cv2.cvtColor(annotated_bgr, cv2.COLOR_BGR2RGB)
    
    plt.figure(figsize=(10, 10))
    plt.imshow(annotated_rgb)
    plt.title(f"Inference: {Path(image_path).name} (Detections: {len(res.boxes)})", fontsize=14, fontweight="bold")
    plt.axis("off")
    plt.show()
    
    # Print summary of detections
    if len(res.boxes) > 0:
        det_summary = []
        for box in res.boxes:
            cid = int(box.cls[0].item())
            conf = float(box.conf[0].item())
            det_summary.append({
                "Class ID": cid,
                "Polymer": CLASS_NAMES.get(cid, "Unknown"),
                "Confidence": f"{conf:.2%}",
                "Box (xyxy)": [round(v, 1) for v in box.xyxy[0].tolist()]
            })
        return pd.DataFrame(det_summary)
    else:
        print("No particles detected above confidence threshold.")
        return pd.DataFrame()

# Test inference on a sample frame from test split
test_samples = list((IMAGES_DIR / "test").glob("*.jpg"))
if test_samples:
    print(f"Testing inference on: {test_samples[0]}")
    # df_res = run_inference_and_plot(model, test_samples[0])""")

    # -------------------------------------------------------------
    # CELL 17: Quantitative Particle Analysis Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 8. Quantitative Microplastic Analysis (Physical Sizing & Concentration)

A crucial step in microplastic monitoring is **particle physical sizing** and **size distribution estimation**.

### Pixel-to-Micrometer Calibration
Using the objective lens magnification scale:
$$\\text{Physical Dimension} (\\mu\\text{m}) = \\frac{\\text{Pixel Dimension}}{\\text{Scale Factor} (\\text{pixels}/\\mu\\text{m})}$$

### Size Classification:
- **Small Microplastics**: $20\\,\\mu\\text{m} - 100\\,\\mu\\text{m}$
- **Medium Microplastics**: $100\\,\\mu\\text{m} - 300\\,\\mu\\text{m}$
- **Large Microplastics**: $300\\,\\mu\\text{m} - 1000\\,\\mu\\text{m}$
- **Mesoplastics / Macro**: $1000\\,\\mu\\text{m} - 5000\\,\\mu\\text{m}$ ($1-5\\,\\text{mm}$)""")

    # -------------------------------------------------------------
    # CELL 18: Quantitative Analysis Script / Code
    # -------------------------------------------------------------
    add_cell("code", """class MicroplasticQuantifier:
    def __init__(self, pixels_per_micron=0.5, img_dimensions=(640, 640)):
        \"\"\"
        pixels_per_micron: Camera calibration factor.
        For example: at 10x magnification with a 5MP CMOS camera, 1 um ~ 0.5 - 1.2 pixels.
        \"\"\"
        self.scale = pixels_per_micron
        self.img_w, self.img_h = img_dimensions
        
    def analyze_detections(self, boxes_list):
        \"\"\"
        boxes_list: list of dicts with keys: 'class_id', 'w_norm', 'h_norm', 'confidence'
        \"\"\"
        results = []
        for b in boxes_list:
            w_px = b["w_norm"] * self.img_w
            h_px = b["h_norm"] * self.img_h
            
            # Physical dimensions in micrometers
            w_um = w_px / self.scale
            h_um = h_px / self.scale
            
            # Maximum Feret diameter approximation (major dimension)
            feret_max_um = max(w_um, h_um)
            feret_min_um = min(w_um, h_um)
            area_um2 = math.pi * (w_um / 2) * (h_um / 2)
            
            # Size classification
            if feret_max_um < 100:
                cat = "< 100 um (Fine Microplastic)"
            elif feret_max_um < 300:
                cat = "100 - 300 um (Medium Microplastic)"
            elif feret_max_um < 1000:
                cat = "300 - 1000 um (Coarse Microplastic)"
            else:
                cat = "1 - 5 mm (Large Microplastic)"
                
            results.append({
                "polymer": CLASS_NAMES.get(b["class_id"], "Unknown"),
                "class_id": b["class_id"],
                "width_um": w_um,
                "height_um": h_um,
                "feret_max_um": feret_max_um,
                "area_um2": area_um2,
                "size_category": cat,
                "confidence": b.get("confidence", 1.0)
            })
        return pd.DataFrame(results)

# Demonstrate quantification on annotations
quantifier = MicroplasticQuantifier(pixels_per_micron=0.65, img_dimensions=(640, 640))
sample_boxes = [
    {"class_id": row["class_id"], "w_norm": row["width"], "h_norm": row["height"]}
    for _, row in df_boxes.sample(min(500, len(df_boxes)), random_state=SEED).iterrows()
]

df_quant = quantifier.analyze_detections(sample_boxes)

# Plot physical characterization
fig, axes = plt.subplots(1, 2, figsize=(16, 6))

# 1. Size Distribution by Category
sns.countplot(data=df_quant, y="size_category", hue="polymer", palette="tab10", ax=axes[0])
axes[0].set_title("Particle Count by Size Category & Polymer", fontsize=12, fontweight="bold")
axes[0].set_xlabel("Particle Count")
axes[0].set_ylabel("Size Category")

# 2. Polymer Abundance Pie Chart
polymer_counts = df_quant["polymer"].value_counts()
axes[1].pie(polymer_counts.values, labels=polymer_counts.index, autopct="%1.1f%%",
            colors=sns.color_palette("Set2"), startangle=140)
axes[1].set_title("Relative Polymer Abundance (%)", fontsize=12, fontweight="bold")

plt.tight_layout()
plt.show()

print("\\n--- Physical Quantification Statistics ---")
print(df_quant[["feret_max_um", "area_um2"]].describe().to_string())""")

    # -------------------------------------------------------------
    # CELL 19: Edge Hardware Export Header / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 9. Model Export for Portable Edge Devices

For field operations on low-cost devices (e.g. Raspberry Pi 4/5, NVIDIA Jetson Orin Nano), the trained PyTorch weights (`.pt`) can be exported to optimized runtime formats:

| Format | Deployment Target | Expected Speedup |
|:---|:---|:---:|
| **ONNX** (`.onnx`) | CPU / Cross-platform runtimes | $2\\times - 3\\times$ |
| **OpenVINO** (`_openvino_model/`) | Intel NUC / Core Ultra / Movidius VPU | $3\\times - 5\\times$ |
| **TensorRT** (`.engine`) | NVIDIA Jetson Nano / Orin | $4\\times - 8\\times$ |
| **TFLite** (`.tflite`) | ARM Edge Devices / Android / Coral TPU | $2\\times - 4\\times$ |""")

    # -------------------------------------------------------------
    # CELL 20: Edge Export Script / Code
    # -------------------------------------------------------------
    add_cell("code", """def export_edge_models(trained_model, export_formats=["onnx"]):
    \"\"\"
    Exports YOLOv8 weights into portable edge formats.
    Supported: 'onnx', 'openvino', 'tflite', 'engine' (TensorRT)
    \"\"\"
    exported_paths = {}
    for fmt in export_formats:
        try:
            print(f"Exporting model to {fmt.upper()} format...")
            path = trained_model.export(format=fmt, imgsz=640, half=False)
            exported_paths[fmt] = path
            print(f"[SUCCESS] Exported {fmt.upper()} to: {path}")
        except Exception as e:
            print(f"[!] Failed exporting to {fmt}: {e}")
            
    return exported_paths

print("To export your trained model for edge hardware, run:")
print(">>> export_edge_models(model, export_formats=['onnx'])")""")

    # -------------------------------------------------------------
    # CELL 21: Conclusion & Citation / Markdown
    # -------------------------------------------------------------
    add_cell("markdown", """---
## 10. Conclusion & Citation

This notebook completes the deep learning workflow for automated microplastic detection, polymer classification, and size characterization from Nile Red fluorescence microscopy.

If using this implementation or the dataset in academic research, please cite:
```bibtex
@article{rermborirak2025low,
  title={Low-cost portable microplastic detection system integrating nile red fluorescence staining with YOLOv8-based deep learning},
  author={Rermborirak, Kittanon and Nanuan, Phutawan and Komonpan, Pattarapon and Sukpancharoen, Somboon},
  journal={Journal of Hazardous Materials Advances},
  volume={19},
  pages={100787},
  year={2025},
  publisher={Elsevier},
  doi={10.1016/j.hazadv.2025.100787}
}
```""")

    output_path = Path("d:/Micro-Plastics/ml/yolov8_microplastic_detection.ipynb")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(notebook, f, indent=1, ensure_ascii=False)
    
    print(f"Successfully generated notebook with {len(notebook['cells'])} cells at {output_path.resolve()}")

if __name__ == "__main__":
    create_notebook()
