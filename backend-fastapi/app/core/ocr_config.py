import pytesseract
import shutil

tesseract_path = shutil.which("tesseract")
if tesseract_path is None:
    raise Exception("Tesseract is not installed on server")

pytesseract.pytesseract.tesseract_cmd = tesseract_path