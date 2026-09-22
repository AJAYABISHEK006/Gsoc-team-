import os

PORT = int(os.getenv("PORT", 5000))
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/plastic-ledger")
SCALE_PIXELS_PER_MICRON = float(os.getenv("SCALE_PIXELS_PER_MICRON", 0.65))
PINN_DIFFUSIVITY = float(os.getenv("PINN_DIFFUSIVITY", 12.5))
