import cloudinary.uploader
from app.core.cloudinary_config import cloudinary


def upload_to_cloudinary(file, folder: str):

    result = cloudinary.uploader.upload(
        file.file,
        folder=folder
    )

    return result["secure_url"]