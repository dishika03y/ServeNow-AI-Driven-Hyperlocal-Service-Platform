import os
import requests
import tempfile
from deepface import DeepFace

def download_image(url):
    response = requests.get(url, timeout=10)
    # Use delete=False so DeepFace can access the file by path
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    temp_file.write(response.content)
    temp_file.close()
    return temp_file.name

def compare_faces(aadhaar_url: str, selfie_url: str):
    aadhaar_path = None
    selfie_path = None
    try:
        aadhaar_path = download_image(aadhaar_url)
        selfie_path = download_image(selfie_url)

        # This will raise an exception if a face isn't found
        result = DeepFace.verify(
            img1_path=aadhaar_path,
            img2_path=selfie_path,
            detector_backend="retinaface", # Better accuracy than opencv
            enforce_detection=True,        # Keeping this TRUE as per your requirement
            align=True
        )

        score = 1 - result["distance"]
        match = result["verified"] # Use DeepFace's internal verification logic

        return {
            "match": match, 
            "score": round(score, 2), 
            "status": "Success"
        }
        
    except ValueError as v_error:
        # This specifically catches "Face could not be detected" errors
        return {"match": False, "score": 0, "error": "Face not detected in one of the images", "status": "Detection Failed"}
    except Exception as e:
        return {"match": False, "score": 0, "error": str(e), "status": "Error"}
    finally:
        if aadhaar_path and os.path.exists(aadhaar_path): os.remove(aadhaar_path)
        if selfie_path and os.path.exists(selfie_path): os.remove(selfie_path)