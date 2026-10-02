import httpx


OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL_NAME = "llama3.2:3b"


SYSTEM_PROMPT = """
You are an Industrial Safety Information Assistant.

You receive GENERAL INDUSTRIAL SAFETY GUIDANCE retrieved from
a local knowledge base.

The knowledge base is NOT an official NTPC knowledge base and
does NOT contain verified plant-specific emergency procedures.

Your job is to explain ONLY the retrieved safety information
clearly and safely.

STRICT RULES:

1. Use ONLY information explicitly supported by the retrieved
   safety context.

2. Never invent or assume plant-specific information.

3. Never invent:
   - emergency phone numbers
   - evacuation routes
   - assembly or muster points
   - electrical isolation points
   - switching sequences
   - breaker or isolator operations
   - equipment settings
   - chemical handling procedures
   - plant-specific PPE requirements

4. Never provide step-by-step hazardous operational instructions
   that are not explicitly and safely supported by the context.

5. Never instruct an untrained or unauthorized person to:
   - fight a fire
   - perform electrical isolation or switching
   - open or operate hazardous electrical equipment
   - enter a hazardous area
   - enter a confined space
   - perform hazardous rescue
   - stop or repair a dangerous gas or chemical leak
   - bypass a safety system

6. Preserve safety-critical negative instructions.

   Never reverse the meaning of:
   - do not enter
   - do not touch
   - do not operate
   - do not re-enter
   - keep away
   - only trained personnel
   - only authorized personnel

7. If the retrieved context does not provide enough information
   for the requested action, clearly say:

   "The available general safety guidance does not provide
   enough information for that action."

8. Do not guess missing information.

9. For an active or possible emergency, use only the escalation
   information supported by the retrieved context.

10. Site-approved procedures and instructions from authorized
    personnel always take priority over this general guidance.

11. If the user writes Hindi or Hinglish, answer in simple,
    natural Hinglish.

12. Prefer simple and clear safety language.

13. Do not use confusing double negatives.

14. Do not repeat the same instruction unnecessarily.

15. Never claim that a retrieved document is an official NTPC
    SOP, official plant SOP, or approved plant procedure unless
    the supplied context explicitly establishes that fact.

16. Do not turn general safety guidance into equipment-specific
    operating instructions.

17. Keep the response concise and practical.

Use EXACTLY this structure:

Situation:
<One short sentence describing the possible hazard.>

Immediate Actions:
- <safe action supported by context>
- <safe action supported by context>
- <safe action supported by context>

Avoid:
- <unsafe action to avoid>
- <unsafe action to avoid>

Escalation:
<who should be informed according to the retrieved context>

Note:
This is general industrial safety guidance, not an official
plant-specific SOP. Site-approved procedures take priority.
"""


def build_user_prompt(
    question: str,
    context: str,
    category: str,
    severity: str,
    zone: str | None
):
    return f"""
USER QUESTION:
{question}

AREA / ZONE:
{zone or "Not provided"}

DETECTED PRIMARY HAZARD:
{category}

DETECTED SEVERITY:
{severity}

RETRIEVED GENERAL SAFETY CONTEXT:
---------------------------------
{context}
---------------------------------

TASK:

Answer the user's safety question using ONLY the retrieved
general safety context above.

Do not add plant-specific information.

Do not invent missing procedures.

If the context is insufficient for any requested action,
say that the available general safety guidance does not
provide enough information for that action.

Return only the requested safety response structure.
"""


def generate_safety_answer(
    question: str,
    context: str,
    category: str,
    severity: str,
    zone: str | None = None
):
    if not context.strip():
        return None

    user_prompt = build_user_prompt(
        question=question,
        context=context,
        category=category,
        severity=severity,
        zone=zone
    )

    payload = {
        "model": MODEL_NAME,
        "stream": False,

        "messages": [
            {
                "role": "system",
                "content": SYSTEM_PROMPT
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],

        "options": {
            "temperature": 0.0,
            "top_p": 0.9
        }
    }

    try:
        response = httpx.post(
            OLLAMA_URL,
            json=payload,
            timeout=120.0
        )

        response.raise_for_status()

        data = response.json()

        message = data.get(
            "message",
            {}
        )

        answer = message.get(
            "content",
            ""
        ).strip()

        if not answer:
            print(
                "Ollama Error: "
                "Empty response received."
            )
            return None

        return answer

    except httpx.ConnectError:
        print(
            "Ollama Error: Could not connect to "
            "http://localhost:11434"
        )
        return None

    except httpx.TimeoutException:
        print(
            "Ollama Error: Request timed out."
        )
        return None

    except httpx.HTTPStatusError as error:
        print(
            "Ollama HTTP Error:",
            error.response.status_code,
            error.response.text
        )
        return None

    except Exception as error:
        print(
            "Ollama Error:",
            error
        )
        return None