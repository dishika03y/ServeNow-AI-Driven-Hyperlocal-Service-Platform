import re


def parse_aadhaar_text(text: str):

    aadhaar_number = re.search(r"\d{4}\s\d{4}\s\d{4}", text)

    dob = re.search(r"\d{2}/\d{2}/\d{4}", text)

    name = None

    lines = text.split("\n")

    for line in lines:
        if line.isupper() and len(line) > 5:
            name = line.strip()
            break

    return {
        "aadhaarNumber": aadhaar_number.group() if aadhaar_number else None,
        "dob": dob.group() if dob else None,
        "name": name
    }