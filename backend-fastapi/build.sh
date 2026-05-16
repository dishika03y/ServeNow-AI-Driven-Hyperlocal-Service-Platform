#!/usr/bin/env bash
# exit on error
set -o errexit

# Install Tesseract OCR
apt-get update && apt-get install -y tesseract-ocr libgl1-mesa-glx

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt