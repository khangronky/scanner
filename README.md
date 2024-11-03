# NEO Culture Technology ID Scanner

This project is a web application for capturing ID information using a webcam.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Railroad-Wrecker/NCT-ID-Scanner.git
   cd your-repo-name
   ```

2. **Install the required Python packages**:
   Make sure you have Python and pip installed, then run:
   ```bash
   pip install opencv-python pytesseract pandas Flask Flask-Cors
   ```

3. **Install Node.js packages** (for the frontend):
   Navigate to the frontend directory (if applicable) and run:
   ```bash
   npm install
   ```

## Running the Project

1. **Start the Backend Server**:
   Run the following command in the backend directory:
   ```bash
   python main.py
   ```

2. **Start the Frontend Application**:
   In the frontend directory, run:
   ```bash
   npm start
   ```

3. **Open in Browser**:
   After starting the application, open your web browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. **Capture ID Information**: Allow access to your webcam and click the "Capture and Display ID" button.
2. **View and Manage IDs**: View captured IDs in a table, edit, delete, or add new IDs as needed.
3. **Export to CSV**: Click the "Export to CSV" button to download the ID data.

## License

This project is provided as is, I will not be responsible if you somehow manage to burn down your entire house or get hit by a plane while using my program.
