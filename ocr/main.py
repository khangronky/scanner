import base64
import os
import re

import cv2
import numpy as np
import pytesseract

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Path to Tesseract executable - for local development
if os.environ.get('ENVIRONMENT') != 'production':
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Initialize FastAPI app
app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def preprocess_image(frame):
    """
    Preprocess the image for better OCR results.
    - Converts the image to grayscale.
    - Applies Gaussian blur to reduce noise.
    - Applies adaptive thresholding for better text clarity.
    """
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    # Apply adaptive thresholding
    thresh = cv2.adaptiveThreshold(blurred, 255, 
                                   cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
                                   cv2.THRESH_BINARY, 11, 2)
    return thresh

def process_frame_for_text(frame):
    """
    Processes the frame and extracts text using Tesseract OCR.
    """
    preprocessed_frame = preprocess_image(frame)
    return pytesseract.image_to_string(preprocessed_frame)

def extract_name_from_text(text):
    """
    Extracts name and student number from the extracted text.
    Updated to remove specified keywords and months before processing.
    Handles names split across lines and formats uppercase names correctly.
    """
    # Define the excluded keywords, including months of the year
    excluded_keywords = r"(RMIT|Student|STUDENT|UNIVERSITY|SINH\sVIEN|January|February|March|April|May|June|July|August|September|October|November|December)"

    # Remove excluded keywords from the text
    cleaned_text = re.sub(excluded_keywords, '', text, flags=re.IGNORECASE)

    # Pattern to match full names (first and last) allowing for newlines or spaces between parts,
    # followed by a student number.
    combined_pattern = r"([A-Z][a-zA-Z]+(?:[\s\n]+[A-Z][a-zA-Z]+)*)\s*\n*\s*(\d{7})"
    match = re.search(combined_pattern, cleaned_text)

    if match:
        name, student_number = match.groups()
        
        # Split the name into parts and format
        name_parts = name.split()
        formatted_name_parts = [
            part.capitalize() if part.isupper() else part for part in name_parts
        ]
        formatted_name = ' '.join(formatted_name_parts)
        
        return formatted_name.strip(), student_number.strip()
    
    return None

class Image(BaseModel):
    imageData: str

@app.post('/capture')
def capture(image: Image):
    """
    Endpoint to capture an image, process it, and extract ID information.
    """
    try: 
        # Decode the base64 image
        image_data = image.imageData.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            raise HTTPException(status_code=400, detail="Image could not be decoded")

        # Process the frame and extract text
        extracted_text = process_frame_for_text(frame)
        print(extracted_text)
        id_info = extract_name_from_text(extracted_text)

        if id_info:
            name, student_number = id_info
            return {"name": name.strip(), "studentNumber": student_number.strip()}
        else:
            raise HTTPException(status_code=400, detail="No match found in the provided ID data")
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    
def create_app():
    return app