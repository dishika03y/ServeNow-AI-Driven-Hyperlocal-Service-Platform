import cv2
import numpy as np
import requests
from PIL import Image
import pytesseract
import io
from app.core.ocr_config import pytesseract


def extract_text_from_image(image_url: str):

    # Download image properly
    response = requests.get(image_url, timeout=10)

    if response.status_code != 200:
        raise Exception("Failed to download image")

    # Convert bytes to image
    image_bytes = response.content
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Convert to OpenCV
    open_cv_img = np.array(img)

    gray = cv2.cvtColor(open_cv_img, cv2.COLOR_BGR2GRAY)

    # Improve OCR quality
    gray = cv2.threshold(
        gray, 150, 255, cv2.THRESH_BINARY
    )[1]

    text = pytesseract.image_to_string(gray)

    return text