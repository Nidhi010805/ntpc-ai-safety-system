
import os
import sys
import importlib
from pathlib import Path


# =====================================
# MODEL TEAM CONFIGURATION
# =====================================

MODEL_PROJECT_DIR = os.getenv(
    "PPE_MODEL_PROJECT_DIR",
    ""
)

INFERENCE_MODULE = os.getenv(
    "PPE_INFERENCE_MODULE",
    "ppe_inference_adapter"
)


# =====================================
# LOAD MODEL TEAM'S ADAPTER
# =====================================

def load_model_adapter():

    if not MODEL_PROJECT_DIR:
        raise RuntimeError(
            "PPE_MODEL_PROJECT_DIR is not configured."
        )

    project_path = Path(
        MODEL_PROJECT_DIR
    ).resolve()

    if not project_path.is_dir():
        raise RuntimeError(
            f"Model project directory not found: {project_path}"
        )

    project_path = str(project_path)

    if project_path not in sys.path:
        sys.path.insert(0, project_path)

    try:
        module = importlib.import_module(
            INFERENCE_MODULE
        )

    except ImportError as exc:
        raise RuntimeError(
            f"Cannot load model adapter '{INFERENCE_MODULE}'. "
            "Ask the model team to provide the inference adapter."
        ) from exc

    inference_function = getattr(
        module,
        "run_inference",
        None
    )

    if not callable(inference_function):
        raise RuntimeError(
            "Model adapter must provide run_inference()."
        )

    return inference_function


# =====================================
# RUN PPE INFERENCE
# =====================================

def run_ppe_inference(
    video_path,
    output_dir
):

    video_path = Path(video_path).resolve()
    output_dir = Path(output_dir).resolve()

    if not video_path.is_file():
        raise FileNotFoundError(
            f"Input video not found: {video_path}"
        )

    output_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    inference_function = load_model_adapter()

    # Call model team's implementation.
    result = inference_function(
        video_path=str(video_path),
        output_dir=str(output_dir)
    )

    if not isinstance(result, dict):
        raise ValueError(
            "Model adapter must return a dictionary."
        )

    if not isinstance(
        result.get("detections"),
        list
    ):
        raise ValueError(
            "Model output must contain a detections list."
        )

    if not isinstance(
        result.get("summary"),
        dict
    ):
        raise ValueError(
            "Model output must contain a summary dictionary."
        )

    if not isinstance(
        result.get("video"),
        dict
    ):
        raise ValueError(
            "Model output must contain video metadata."
        )

    # Keep annotated video path separate
    # from the JSON detection results.

    annotated_path = result.get(
        "annotated_video_path"
    )

    if annotated_path:
        annotated_path = Path(
            annotated_path
        ).resolve()

        if not annotated_path.is_file():
            raise FileNotFoundError(
                "Annotated video was not generated."
            )

        result["annotated_video_path"] = str(
            annotated_path
        )

    return result
