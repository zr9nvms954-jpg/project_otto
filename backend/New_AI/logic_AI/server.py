import os
import sys
from pathlib import Path
from typing import List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Tự động thêm thư mục chứa file và thư mục gốc vào sys.path để tránh lỗi ModuleNotFoundError
CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from main import generate_car_advice

app = FastAPI(
    title="Showroom AI Assistant API",
    description="API tư vấn bán hàng tự động cho showroom siêu xe",
)

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str
    history: Optional[list[dict]] = []


class ChatResponse(BaseModel):
    response: str


@app.get("/")
def root():
    return {"status": "ok", "message": "Showroom AI Server đang hoạt động!"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        if not request.message.strip():
            raise HTTPException(status_code=400, detail="Câu hỏi không được để trống")

        bot_reply = generate_car_advice(request.message, request.history)
        return ChatResponse(response=bot_reply)

    except Exception as e:
        print(f"[Lỗi Server]: {e}")
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý hệ thống: {str(e)}")


if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=False)
