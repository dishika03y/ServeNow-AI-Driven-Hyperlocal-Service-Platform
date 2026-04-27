import cv2
import numpy as np
import requests
from PIL import Image
import pytesseract
import io
import pytesseract
from app.core.ocr_config import * 


def extract_text_from_image(image_url: str):
    # 1. Download image
    response = requests.get(image_url, timeout=10)
    if response.status_code != 200:
        raise Exception("Failed to download image")

    # 2. Convert to PIL then to Grayscale
    img = Image.open(io.BytesIO(response.content)).convert("L")
    open_cv_img = np.array(img)

    # 3. UPSCALING (CRITICAL for Aadhaar)
    # Aadhaar text is small. Scaling by 2x or 3x helps Tesseract significantly.
    scaled = cv2.resize(open_cv_img, None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)

    # 4. THRESHOLDING
    # Instead of adaptive, we use OTSU which is better for document-style images
    # It automatically finds the best contrast between text and background.
    _, thresh = cv2.threshold(scaled, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    # 5. DENOISING
    # Remove small white dots (noise) that often appear on scanned IDs
    kernel = np.ones((1, 1), np.uint8)
    processed_img = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)

    # 6. Run Tesseract with PSM 6 (Assume a single uniform block of text)
    # This is much faster and more accurate for ID cards than the default.
    text = pytesseract.image_to_string(processed_img, config='--psm 6')

    # DEBUG: Check your terminal to see if text is actually being read
    print("--- DEBUG RAW OCR ---")
    print(text)
    print("---------------------")

    return text