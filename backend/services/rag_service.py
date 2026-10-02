import re

from services.document_service import load_documents


STOP_WORDS = {
    "the",
    "a",
    "an",
    "is",
    "are",
    "of",
    "to",
    "in",
    "on",
    "for",
    "and",
    "or",
    "me",
    "hai",
    "h",
    "ka",
    "ki",
    "ke",
    "kya",
    "kare",
    "karna",
    "gaya",
    "gayi",
    "raha",
    "rahi",
    "ko",
    "se",
    "ye",
    "ya",
    "aur",
    "batao",
    "bata",
    "chahiye"
}


# Which knowledge files are allowed for each detected hazard.
CATEGORY_DOCUMENTS = {
    "fire": {
        "fire_safety.txt",
        "electrical_safety.txt"
    },

    "electrical": {
        "electrical_safety.txt",
        "fire_safety.txt"
    },

    "gas": {
        "gas_leak.txt",
        "chemical_spill.txt"
    },

    "chemical": {
        "chemical_spill.txt",
        "gas_leak.txt"
    },

    "medical": {
        "man_down.txt"
    },

    "ppe": {
        "ppe_safety.txt",
        "work_at_height.txt"
    },

    "work_at_height": {
        "work_at_height.txt",
        "ppe_safety.txt"
    },

    "confined_space": {
        "confined_space.txt"
    },

    "machinery": {
        "machinery_safety.txt"
    },

    "evacuation": {
        "evacuation.txt"
    }
}


def tokenize(text: str):
    words = re.findall(
        r"[a-zA-Z0-9]+",
        text.lower()
    )

    return {
        word
        for word in words
        if len(word) > 2
        and word not in STOP_WORDS
    }


def create_chunks(
    text: str,
    chunk_size: int = 700,
    overlap: int = 100
):
    text = " ".join(text.split())

    if not text:
        return []

    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size

        chunk = text[start:end]

        chunks.append(chunk)

        if end >= len(text):
            break

        start = end - overlap

    return chunks


def build_chunks():
    documents = load_documents()

    chunks = []

    for document in documents:
        document_chunks = create_chunks(
            document["content"]
        )

        for index, content in enumerate(
            document_chunks
        ):
            chunks.append({
                "name": document["name"],
                "category": document["category"],
                "type": document["type"],
                "page": document["page"],
                "chunk": index + 1,
                "content": content
            })

    return chunks


def search_documents(
    query: str,
    limit: int = 5,
    category: str | None = None
):
    query_tokens = tokenize(query)

    if not query_tokens:
        return []

    chunks = build_chunks()

    allowed_documents = None

    if category in CATEGORY_DOCUMENTS:
        allowed_documents = CATEGORY_DOCUMENTS[
            category
        ]

    results = []

    for chunk in chunks:

        # HARD CATEGORY FILTER
        if allowed_documents is not None:
            if chunk["name"] not in allowed_documents:
                continue

        searchable_text = (
            f"{chunk['name']} "
            f"{chunk['category']} "
            f"{chunk['content']}"
        )

        document_tokens = tokenize(
            searchable_text
        )

        common_words = (
            query_tokens & document_tokens
        )

        if not common_words:
            continue

        # Basic lexical relevance
        lexical_score = len(common_words) * 3

        # Filename relevance
        filename_tokens = tokenize(
            chunk["name"].replace("_", " ")
        )

        filename_matches = (
            query_tokens & filename_tokens
        )

        filename_score = (
            len(filename_matches) * 5
        )

        # Primary category document bonus
        category_bonus = 0

        if (
            allowed_documents is not None
            and chunk["name"] in allowed_documents
        ):
            category_bonus = 5

        score = (
            lexical_score
            + filename_score
            + category_bonus
        )

        if score < 5:
            continue

        results.append({
            **chunk,

            "score": score,

            "matched_words": sorted(
                common_words
            ),

            "matched_filename_words": sorted(
                filename_matches
            )
        })

    results.sort(
        key=lambda item: (
            item["score"],
            len(item["matched_words"])
        ),
        reverse=True
    )

    return results[:limit]