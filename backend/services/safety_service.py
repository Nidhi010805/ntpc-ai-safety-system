from services.rag_service import search_documents
from services.llm_service import generate_safety_answer


EMERGENCY_KEYWORDS = {
    "fire": [
        "fire",
        "aag",
        "smoke",
        "dhua",
        "dhuan",
        "burning",
        "flame"
    ],

    "chemical": [
        "chemical",
        "spill",
        "acid",
        "caustic",
        "toxic"
    ],

    "gas": [
        "gas",
        "gas leak",
        "chlorine",
        "ammonia",
        "fumes",
        "vapour",
        "vapor"
    ],

    "electrical": [
        "electrical",
        "electric",
        "electric shock",
        "shock",
        "spark",
        "sparks",
        "arc",
        "short circuit",
        "switchyard",
        "panel",
        "electrical panel",
        "transformer",
        "breaker",
        "isolator",
        "isolation",
        "isolate",
        "voltage"
    ],

    "medical": [
        "injury",
        "injured",
        "unconscious",
        "collapse",
        "collapsed",
        "bleeding",
        "man down"
    ],

    "ppe": [
        "ppe",
        "helmet",
        "gloves",
        "safety shoes",
        "goggles"
    ],

    "work_at_height": [
        "work at height",
        "height",
        "harness",
        "ladder",
        "scaffold",
        "scaffolding",
        "roof",
        "lifeline",
        "fall"
    ],

    "confined_space": [
        "confined space",
        "confined",
        "tank",
        "vessel",
        "pit",
        "chamber"
    ],

    "machinery": [
        "machine",
        "machinery",
        "conveyor",
        "rotating",
        "guard"
    ],

    "evacuation": [
        "evacuation",
        "evacuate",
        "assembly point",
        "muster point",
        "emergency exit"
    ]
}


HIGH_RISK_PROCEDURAL_PATTERNS = [
    "exact steps",
    "step by step",
    "steps bata",
    "procedure bata",
    "sequence bata",
    "kaise isolate",
    "isolate kaise",
    "isolation steps",
    "switching sequence",
    "switching steps",
    "breaker operate",
    "breaker kaise",
    "isolator operate",
    "isolator kaise",
    "de energize",
    "de-energize",
    "energize",
    "lockout",
    "lock out",
    "tagout",
    "tag out",
    "loto",
    "bypass",
    "interlock bypass",
    "equipment setting",
    "relay setting",
    "trip setting"
]


CATEGORY_PRIORITY = {
    "electrical": 10,
    "gas": 9,
    "chemical": 8,
    "medical": 7,
    "confined_space": 6,
    "work_at_height": 5,
    "fire": 4,
    "machinery": 3,
    "ppe": 2,
    "evacuation": 1
}


def detect_category(message: str):
    text = message.lower()

    scores = {}

    for category, keywords in EMERGENCY_KEYWORDS.items():
        score = 0

        for keyword in keywords:
            if keyword in text:
                if " " in keyword:
                    score += 3
                else:
                    score += 1

        if score > 0:
            scores[category] = score

    if not scores:
        return "general_safety"

    electrical_context = [
        "transformer",
        "switchyard",
        "electrical panel",
        "breaker",
        "isolator",
        "voltage",
        "electric shock"
    ]

    if any(
        keyword in text
        for keyword in electrical_context
    ):
        scores["electrical"] = (
            scores.get("electrical", 0) + 4
        )

    gas_context = [
        "gas leak",
        "chlorine",
        "ammonia"
    ]

    if any(
        keyword in text
        for keyword in gas_context
    ):
        scores["gas"] = (
            scores.get("gas", 0) + 4
        )

    medical_context = [
        "unconscious",
        "man down",
        "bleeding"
    ]

    if any(
        keyword in text
        for keyword in medical_context
    ):
        scores["medical"] = (
            scores.get("medical", 0) + 4
        )

    height_context = [
        "work at height",
        "scaffold",
        "scaffolding",
        "ladder",
        "lifeline"
    ]

    if any(
        keyword in text
        for keyword in height_context
    ):
        scores["work_at_height"] = (
            scores.get("work_at_height", 0) + 4
        )

    return max(
        scores,
        key=lambda category: (
            scores[category],
            CATEGORY_PRIORITY.get(category, 0)
        )
    )


def detect_severity(category: str):
    if category in [
        "fire",
        "chemical",
        "gas",
        "electrical",
        "medical",
        "confined_space"
    ]:
        return "critical"

    if category in [
        "ppe",
        "work_at_height",
        "machinery"
    ]:
        return "high"

    return "medium"


def is_high_risk_procedural_request(
    message: str,
    category: str
):
    text = message.lower()

    if category == "electrical":
        electrical_operations = [
            "isolate",
            "isolation",
            "switching",
            "breaker",
            "isolator",
            "de energize",
            "de-energize",
            "energize",
            "lockout",
            "lock out",
            "tagout",
            "tag out",
            "loto",
            "bypass",
            "setting"
        ]

        for operation in electrical_operations:
            if operation in text:
                return True

    for pattern in HIGH_RISK_PROCEDURAL_PATTERNS:
        if pattern in text:
            return True

    return False


def build_sources(results):
    sources = []
    seen = set()

    for result in results:
        key = (
            result["name"],
            result.get("page")
        )

        if key in seen:
            continue

        seen.add(key)

        sources.append({
            "document": result["name"],
            "category": result["category"],
            "page": result.get("page"),
            "score": result["score"]
        })

    return sources


def build_context(results):
    context_parts = []

    for result in results:
        source_name = result["name"]

        if result.get("page"):
            source_name += (
                f" - Page {result['page']}"
            )

        context_parts.append(
            f"""
SOURCE: {source_name}
CATEGORY: {result["category"]}

{result["content"]}
"""
        )

    return "\n\n".join(context_parts)


def procedural_safety_answer(
    category: str
):
    if category == "electrical":
        return (
            "Situation:\n"
            "Aap electrical equipment ke liye operational "
            "ya isolation procedure pooch rahe hain.\n\n"

            "Immediate Actions:\n"
            "- Equipment se safe distance maintain karein "
            "agar electrical hazard suspected hai.\n"
            "- Designated control room, supervisor ya "
            "authorized electrical personnel ko inform karein.\n"
            "- Applicable site-approved electrical procedure "
            "follow karein.\n\n"

            "Avoid:\n"
            "- Breaker, isolator, switch ya transformer ko "
            "is guidance ke basis par operate na karein.\n"
            "- Electrical isolation, switching, LOTO ya testing "
            "khud attempt na karein unless trained, authorized "
            "and permitted under the applicable approved "
            "procedure.\n\n"

            "Escalation:\n"
            "Authorized electrical personnel aur applicable "
            "site authority ko involve karein.\n\n"

            "Note:\n"
            "Available general safety guidance exact "
            "equipment-specific isolation or switching steps "
            "provide nahi karti. Yeh general industrial safety "
            "guidance hai, official plant-specific SOP nahi."
        )

    return (
        "Situation:\n"
        "Aap ek safety-critical operational procedure "
        "pooch rahe hain.\n\n"

        "Immediate Actions:\n"
        "- Applicable site-approved procedure follow karein.\n"
        "- Trained and authorized personnel ko involve karein.\n\n"

        "Avoid:\n"
        "- Missing procedural details ko guess na karein.\n"
        "- General AI guidance ke basis par hazardous "
        "operation perform na karein.\n\n"

        "Escalation:\n"
        "Designated supervisor, safety team, control room "
        "ya appropriate authorized personnel ko inform karein.\n\n"

        "Note:\n"
        "Available general safety guidance requested "
        "plant-specific operational steps provide nahi karti."
    )


def no_knowledge_answer():
    return (
        "Situation:\n"
        "Loaded knowledge base me is question ke liye "
        "relevant general safety guidance available nahi hai.\n\n"

        "Immediate Actions:\n"
        "- Applicable site-approved procedure follow karein.\n"
        "- Appropriate supervisor, safety team ya authorized "
        "personnel ko inform karein.\n\n"

        "Avoid:\n"
        "- Missing procedure ko guess na karein.\n"
        "- Unverified AI instructions ke basis par hazardous "
        "operation perform na karein.\n\n"

        "Escalation:\n"
        "Situation ke according designated supervisor, "
        "control room, safety team ya emergency response "
        "personnel ko involve karein.\n\n"

        "Note:\n"
        "No relevant guidance was found in the loaded "
        "general safety knowledge base."
    )


def fallback_answer(severity: str):
    if severity == "critical":
        return (
            "Relevant general safety guidance was found, "
            "but the local AI service is currently unavailable. "
            "Follow site alarms and approved emergency procedures, "
            "keep personnel away from the hazardous area when "
            "appropriate, and inform the designated control room "
            "or emergency response team."
        )

    return (
        "Relevant general industrial safety guidance was found, "
        "but the local AI service is currently unavailable. "
        "Please review the listed source documents and follow "
        "applicable site-approved procedures."
    )


def answer_safety_question(
    message: str,
    zone: str | None = None
):
    clean_message = message.strip()

    category = detect_category(
        clean_message
    )

    severity = detect_severity(
        category
    )

    search_query = clean_message

    if zone:
        search_query += f" {zone.strip()}"

    results = search_documents(
        search_query,
        limit=5,
        category=category
    )

    sources = build_sources(
        results
    )

    if not results:
        return {
            "category": category,
            "severity": severity,
            "answer": no_knowledge_answer(),
            "sources": [],
            "grounded": False,
            "ai_generated": False,
            "escalation_required": severity in [
                "critical",
                "high"
            ]
        }

    if is_high_risk_procedural_request(
        clean_message,
        category
    ):
        return {
            "category": category,
            "severity": severity,
            "answer": procedural_safety_answer(
                category
            ),
            "sources": sources,
            "grounded": True,
            "ai_generated": False,
            "escalation_required": True
        }

    context = build_context(
        results
    )

    ai_answer = generate_safety_answer(
        question=clean_message,
        context=context,
        category=category,
        severity=severity,
        zone=zone
    )

    if ai_answer:
        final_answer = ai_answer
        ai_generated = True
    else:
        final_answer = fallback_answer(
            severity
        )
        ai_generated = False

    return {
        "category": category,
        "severity": severity,
        "answer": final_answer,
        "sources": sources,
        "grounded": True,
        "ai_generated": ai_generated,
        "escalation_required": severity in [
            "critical",
            "high"
        ]
    }