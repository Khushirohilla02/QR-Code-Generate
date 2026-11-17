from fastapi import FastAPI, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from pathlib import Path
import qrcode
app = FastAPI()

BASE_DIR = Path(__file__).resolve().parent

STATIC_DIR = BASE_DIR / "static"

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
templates = Jinja2Templates(directory=str(BASE_DIR / "templates"))

QR_FILE = STATIC_DIR /"images" / "qr_code.png"


class QRRequest(BaseModel):
    url: str

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")

@app.post("/qr")
async def generate_qr(data: QRRequest):
    url=data.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="Please enter a URL")
    
    try:
        img = qrcode.make(url)
        img.save(str(QR_FILE), format="PNG")
        return FileResponse(path=str(QR_FILE), media_type="image/png")
    except Exception as e:
        print("QR ERROR:", e)
        raise HTTPException(status_code=500, detail=str(e))