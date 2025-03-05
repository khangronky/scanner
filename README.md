# NEO ID Scanner

![Capture Page](./public/capture-page.jpg)

This project is a web application for capturing and processing ID information using a webcam and advanced OCR technology.

## Technology Stack

- **Frontend**: Next.js 15, React 18, TailwindCSS
- **Backend**: FastAPI (Python)
- **OCR Engine**: PaddleOCR
- **Deployment**: Modal (for OCR service)
- **Testing**: Vitest

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (Latest LTS version)
- Python 3.8 or higher
- pip (Python package manager)

## Project Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/khangronky/scanner.git
   cd scanner
   ```

2. **Install Node.js packages**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env.local` and configure your environment variables:

   ```bash
   cp .env.example .env.local
   ```

4. **Install Python dependencies**:
   This will create a virtual environment and install all required Python packages:

   ```bash
   npm run ocr:install
   ```

## Running the Project

1. **Start the Next.js Development Server**:

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

2. **Start the OCR Service** (Development):

   ```bash
   npm run ocr:dev
   ```

   The OCR service will run at `http://localhost:5500`

## Deployment

1. **Deploy OCR Service**:

   ```bash
   npm run ocr:deploy
   ```

2. **Run OCR Service**:

   ```bash
   npm run ocr:run
   ```

3. **Serve OCR Service**:

   ```bash
   npm run ocr:serve
   ```

## Development Scripts

- `npm run dev` - Start Next.js development server with Turbopack
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest

## Features

1. **Real-time ID Scanning**: Capture ID information using your device's webcam
2. **Advanced OCR Processing**: Utilize PaddleOCR for accurate text extraction
3. **Data Management**: View, edit, and manage captured ID information
4. **Export Functionality**: Export ID data to CSV format
5. **Modern UI**: Built with TailwindCSS and Radix UI components

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
