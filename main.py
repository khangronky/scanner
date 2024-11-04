from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import re
import pytesseract
import base64

# Path to Tesseract executable
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Initialize Flask app
app = Flask(__name__)
CORS(app)

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
    Updated pattern matches full names with varying lengths and student numbers.
    """
    # Pattern to match full names (first and last) followed by a student number
    combined_pattern = r"([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)*)\s+(\d{7})"  # Ensure ID is exactly 7 digits
    match = re.search(combined_pattern, text)
    return match.groups() if match else None

@app.route('/capture', methods=['POST'])
def capture():
    """
    Endpoint to capture an image, process it, and extract ID information.
    """
    data = request.json
    if 'imageData' not in data:
        return jsonify({'error': 'No image data provided'}), 400

    # Decode the base64 image
    image_data = data['imageData'].split(',')[1]
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Process the frame and extract text
    extracted_text = process_frame_for_text(frame)
    id_info = extract_name_from_text(extracted_text)

    if id_info:
        name, student_number = id_info
        return jsonify({'name': name.strip(), 'studentNumber': student_number.strip()})
    else:
        return jsonify({'error': 'No match found'}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
