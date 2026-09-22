"""
Mask2Former Architecture Configuration for Microplastic Instance Segmentation
=============================================================================
Defines multi-scale pixel decoders and query transformer decoders for
high-resolution boundary segmentation of transparent & fluorescence microplastics.
"""

MASK2FORMER_CONFIG = {
    "model_type": "mask2former",
    "backbone": "Swin-Transformer-Base",
    "pixel_decoder": "MSDeformAttnPixelDecoder",
    "transformer_decoder": "MultiScaleMaskedAttentionDecoder",
    "num_queries": 100,
    "num_classes": 6,
    "classes": ["ABS", "Nylon", "PE", "PET", "PS", "PVC"],
    "subpixel_refinement": {
        "loss_weight": 2.0,
        "mask_threshold": 0.5,
        "edge_regularization": "SobelLaplacianLoss"
    },
    "calibration": {
        "magnification": "10x",
        "scale_pixels_per_micron": 0.65
    }
}
