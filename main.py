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

def process_frame_for_text(frame):
    return pytesseract.image_to_string(frame)

def extract_name_from_text(text):
    combined_pattern = r"[A-Z][a-z]+ [A-Z][a-z]+\n\d+"
    match = re.search(combined_pattern, text, re.MULTILINE)
    return match.group(0) if match else "No match found"

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

    if id_info != "No match found":
        name, student_number = id_info.split('\n')
        return jsonify({'name': name, 'studentNumber': student_number})
    else:
        return jsonify({'error': 'No match found'}), 200

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
