from pathlib import Path

from pypdf import PdfReader


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

SUPPORTED_EXTENSIONS = {
    ".txt",
    ".pdf"
}


def read_txt(file_path: Path):
    try:
        return file_path.read_text(
            encoding="utf-8",
            errors="ignore"
        ).strip()

    except Exception as error:
        print(
            f"TXT read error "
            f"({file_path.name}): {error}"
        )
        return ""


def read_pdf(file_path: Path):
    pages = []

    try:
        reader = PdfReader(
            str(file_path)
        )

        for page_number, page in enumerate(
            reader.pages,
            start=1
        ):
            try:
                text = (
                    page.extract_text()
                    or ""
                ).strip()

                if not text:
                    continue

                pages.append({
                    "page": page_number,
                    "content": text
                })

            except Exception as error:
                print(
                    f"PDF page read error "
                    f"({file_path.name}, "
                    f"page {page_number}): "
                    f"{error}"
                )

    except Exception as error:
        print(
            f"PDF read error "
            f"({file_path.name}): {error}"
        )

    return pages


def get_document_category(
    file_path: Path
):
    try:
        relative_path = (
            file_path.relative_to(
                DATA_DIR
            )
        )

        if len(relative_path.parts) > 1:
            return relative_path.parts[0]

    except ValueError:
        pass

    return "general"


def load_documents():
    documents = []

    if not DATA_DIR.exists():
        print(
            f"Knowledge base directory "
            f"not found: {DATA_DIR}"
        )
        return documents

    for file_path in DATA_DIR.rglob("*"):

        if not file_path.is_file():
            continue

        extension = (
            file_path.suffix.lower()
        )

        if extension not in SUPPORTED_EXTENSIONS:
            continue

        category = get_document_category(
            file_path
        )

        if extension == ".txt":
            content = read_txt(
                file_path
            )

            if not content:
                print(
                    f"Skipping empty TXT: "
                    f"{file_path.name}"
                )
                continue

            documents.append({
                "name": file_path.name,
                "category": category,
                "type": "txt",
                "page": None,
                "content": content
            })

        elif extension == ".pdf":
            pages = read_pdf(
                file_path
            )

            if not pages:
                print(
                    f"Skipping PDF with no "
                    f"extractable text: "
                    f"{file_path.name}"
                )
                continue

            for page in pages:
                documents.append({
                    "name": file_path.name,
                    "category": category,
                    "type": "pdf",
                    "page": page["page"],
                    "content": page["content"]
                })

    return documents