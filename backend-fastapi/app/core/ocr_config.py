import pytesseract
import shutil

tesseract_path = shutil.which("tesseract")

if not tesseract_path:
    raise Exception("Tesseract not found in container")

pytesseract.pytesseract.tesseract_cmd = tesseract_path