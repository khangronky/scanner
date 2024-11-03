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
    # Convert to grayscale
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    # Apply thresholding to enhance text clarity
    _, thresh = cv2.threshold(blurred, 150, 255, cv2.THRESH_BINARY)
    return thresh

def process_frame_for_text(frame):
    preprocessed_frame = preprocess_image(frame)
    return pytesseract.image_to_string(preprocessed_frame)

def extract_name_from_text(text):
    # Updated pattern to match full names with varying lengths and a student number
    combined_pattern = r"([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\s(\d+)"
    match = re.search(combined_pattern, text)
    return match.groups() if match else None

@app.route('/capture', methods=['POST'])
def capture():
    data = request.json
    if 'imageData' not in data:
        return jsonify({'error': 'No image data provided'}), 400

    # Decode the base64 image
    image_data = data['imageData'].split(',')[1]
    nparr = np.frombuffer(base64.b64decode(image_data), np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    extracted_text = process_frame_for_text(frame)
    id_info = extract_name_from_text(extracted_text)

    if id_info:
        name, student_number = id_info
        return jsonify({'name': name.strip(), 'studentNumber': student_number.strip()})
    else:
        return jsonify({'error': 'No match found'}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
