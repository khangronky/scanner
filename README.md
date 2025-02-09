# NEO Culture Technology ID Scanner

This project is a web application for capturing ID information using a webcam.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Railroad-Wrecker/NCT-ID-Scanner.git
   cd NCT-ID-Scanner
   ```

2. **Install Node.js packages** (for the frontend):
   Make sure you have Node.js and npm installed.

   Navigate to the frontend directory and run:

   ```bash
   cd client
   npm install
   ```

3. **Install Node.js packages** (for the backend):
   Make sure you have Node.js and npm installed.

   Navigate to the backend directory and run:

   ```bash
   cd server
   npm install
   ```

4. **Install the required Python packages**:
   Make sure you have Python and pip installed.

   Make sure you have the Tesseract OCR installed. This can be found [here](https://github.com/UB-Mannheim/tesseract/wiki)

   After installing Tesseract OCR, ensure that its executable is in: `C:\Program Files\Tesseract-OCR\tesseract.exe`

   Navigate to the OCR directory and run:

   ```bash
   cd ocr
   python -m venv venv
   venv/Scripts/activate
   pip install -r requirements.txt
   ```

## Running the Project

1. **Start the Frontend Application**:
   Navigate to the frontend directory and run:

   ```bash
   cd client
   npm run dev
   ```

2. **Start the Backend Server**:
   Navigate to the backend directory and run:

   ```bash
   cd server
   npm run dev
   ```

3. **Start the OCR Service**:
   Navigate to the ocr directory and run:

   ```bash
   cd ocr
   venv/Scripts/activate
   python main.py
   ```

4. **Open in Browser**:
   After starting the application, open your web browser and navigate to:

   ```bash
   http://localhost:5173
   ```

## Usage

1. **Capture ID Information**: Allow access to your webcam and click the "Capture and Display ID" button.
2. **View and Manage IDs**: View captured IDs in a table, edit, delete, or add new IDs as needed.
3. **Export to CSV**: Click the "Export to CSV" button to download the ID data.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
