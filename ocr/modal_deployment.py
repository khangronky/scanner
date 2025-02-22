import modal

image = modal.Image.debian_slim().apt_install(
    "tesseract-ocr",
    "libgl1-mesa-glx",
    "libglib2.0-0"
).pip_install([
    "fastapi",
    "numpy",
    "opencv-python",
    "pytesseract"
]).env({"ENVIRONMENT": "production"}).add_local_python_source("main")  
app = modal.App("ocr-service", image=image)

@app.function()
@modal.asgi_app()
def fastapi_app():
    from main import create_app
    return create_app()