import re

def parse_aadhaar_text(text: str):
    # 1. Extract Aadhaar Number
    aadhaar_number = None
    clean_digits = re.sub(r'\D', '', text)
    num_match = re.search(r'\d{12}', clean_digits)
    if num_match:
        raw = num_match.group()
        aadhaar_number = f"{raw[:4]} {raw[4:8]} {raw[8:]}"

    # 2. Extract DOB (Tuned for your specific image)
    dob = None
    # We look for DOB followed by colon or space, then digits
    # The [^\d]* allows any characters (like Hindi text or slashes) in between
    dob_match = re.search(r"DOB[^\d]*(\d{2})[^\d](\d{2})[^\d](\d{4})", text, re.IGNORECASE)
    
    if dob_match:
        day, month, year = dob_match.groups()
        dob = f"{day}/{month}/{year}"
    else:
        # Fallback: look for any 8 digits in a date-like pattern
        simple_match = re.search(r"(\d{2})[/\-.\s](\d{2})[/\-.\s](\d{4})", text)
        if simple_match:
            dob = f"{simple_match.group(1)}/{simple_match.group(2)}/{simple_match.group(3)}"

    # 3. Extract Name
    lines = [line.strip() for line in text.split("\n") if len(line.strip()) > 2]
    name = None

    for i, line in enumerate(lines):
        if any(keyword in line.upper() for keyword in ["DOB", "YEAR", "BIRTH", "FEMALE", "MALE"]):
            # Check lines above the DOB
            for offset in [1, 2]:
                if i - offset >= 0:
                    candidate = lines[i - offset]
                    # Filter out headers and Hindi-only lines
                    if not any(word in candidate.upper() for word in ["INDIA", "GOVT", "Unique"]):
                        if re.search(r'[a-zA-Z]', candidate):
                            name = re.sub(r'^[a-z]{1,2}\s+', '', candidate, flags=re.IGNORECASE).strip()
                            break
            if name: break

    return {
        "aadhaarNumber": aadhaar_number,
        "dob": dob,
        "name": name
    }