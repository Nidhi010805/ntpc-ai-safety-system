
from datetime import datetime, timezone


# =====================================
# STANDARD PPE CLASSES
# =====================================

STANDARD_PPE_CLASSES = {
    "helmet": "Helmet",
    "hardhat": "Helmet",
    "gloves": "Gloves",
    "glove": "Gloves",
    "boots": "Safety Boots",
    "boot": "Safety Boots",
    "shoes": "Safety Boots",
    "safety_vest": "Hi-Vis Vest",
    "vest": "Hi-Vis Vest",
    "hi_vis_vest": "Hi-Vis Vest",
    "glasses": "Safety Glasses",
    "goggles": "Safety Glasses",
    "harness": "Safety Harness"
}


# =====================================
# NORMALIZE CLASS NAME
# =====================================

def normalize_class(class_name):

    if not class_name:
        return "Unknown"

    key = str(class_name).lower().strip()
    key = key.replace("-", "_").replace(" ", "_")

    return STANDARD_PPE_CLASSES.get(
        key,
        str(class_name).strip().replace("_", " ").title()
    )


# =====================================
# NORMALIZE BOUNDING BOX
# =====================================

def normalize_bbox(bbox):

    if not isinstance(bbox, (list, tuple)):
        return None

    if len(bbox) != 4:
        return None

    try:
        coordinates = [float(value) for value in bbox]

        if not all(
            value == value and abs(value) != float("inf")
            for value in coordinates
        ):
            return None

        return coordinates

    except (ValueError, TypeError):
        return None


# =====================================
# NORMALIZE SINGLE DETECTION
# =====================================

def normalize_detection(detection):

    if not isinstance(detection, dict):
        return None

    class_name = (
        detection.get("class")
        or detection.get("class_name")
        or detection.get("label")
    )

    confidence = detection.get(
        "confidence",
        detection.get("score", 0)
    )

    try:
        confidence = float(confidence)

        if not 0 <= confidence <= 1:
            return None

    except (ValueError, TypeError):
        return None

    bbox = normalize_bbox(
        detection.get("bbox")
        or detection.get("box")
    )

    if bbox is None:
        return None

    try:
        timestamp = float(
            detection.get("timestamp", 0)
        )

        if timestamp < 0:
            return None

    except (ValueError, TypeError):
        return None

    return {
        "track_id": detection.get("track_id"),
        "timestamp": timestamp,
        "class": normalize_class(class_name),
        "confidence": confidence,
        "bbox": bbox,
        "compliant": detection.get("compliant")
    }


# =====================================
# NORMALIZE MODEL RESULTS
# =====================================

def normalize_results(raw_result, job_id):

    if not isinstance(raw_result, dict):
        raise ValueError("Invalid model output format.")

    raw_detections = raw_result.get("detections", [])

    if not isinstance(raw_detections, list):
        raise ValueError("Detections must be a list.")

    detections = []

    for item in raw_detections:

        normalized = normalize_detection(item)

        if normalized is not None:
            detections.append(normalized)

    summary = raw_result.get("summary", {})

    if not isinstance(summary, dict):
        summary = {}

    video = raw_result.get("video", {})

    if not isinstance(video, dict):
        video = {}

    model = raw_result.get("model", {})

    if not isinstance(model, dict):
        model = {}

    total_workers = int(
        summary.get("total_workers", 0)
    )

    compliant_workers = int(
        summary.get("compliant_workers", 0)
    )

    violations = int(
        summary.get("violations", 0)
    )

    if min(
        total_workers,
        compliant_workers,
        violations
    ) < 0:
        raise ValueError("Invalid worker summary.")

    if compliant_workers > total_workers:
        raise ValueError("Invalid compliance count.")

    return {
        "job_id": job_id,

        "status": "completed",

        "processed_at": datetime.now(
            timezone.utc
        ).isoformat(),

        "model": {
            "name": model.get(
                "name", "Unknown"
            ),
            "version": model.get(
                "version", "Unknown"
            )
        },

        "video": {
            "duration": video.get("duration", 0),
            "fps": video.get("fps", 0),
            "processed_frames": video.get(
                "processed_frames", 0
            )
        },

        "summary": {
            "total_workers": total_workers,
            "compliant_workers": compliant_workers,
            "violations": violations
        },

        "detections": detections,

        "annotated_video_url": raw_result.get(
            "annotated_video_url"
        )
    }
