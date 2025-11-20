from PyPDF2 import PdfReader

def extract_text(file_obj, filename):
    if filename.lower().endswith(".pdf"):
        reader = PdfReader(file_obj)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    elif filename.lower().endswith(".txt"):
        return file_obj.read().decode("utf-8")
    else:
        return ""
