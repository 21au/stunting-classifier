import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
from sqlalchemy.orm import Session

from db.database import engine, get_db, Base
from db.models import User
from src.auth_utils import hash_password, verify_password, create_access_token, decode_access_token
from src.auth_schemas import UserCreate, UserLogin, UserOut, Token
from src.explain import explain_prediction
from src.prophet_forecast import get_available_children, forecast_growth, load_longitudinal_data


app = FastAPI(
    title="Stunting & Nutrition Status Classifier API",
    description="API untuk klasifikasi status gizi balita (stunting, underweight, wasting) dengan penjelasan ganda: awam dan klinis.",
    version="2.0.0"
)

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== DEPENDENCY: VALIDASI USER LOGIN =====

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Token tidak ditemukan")

    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Token tidak valid atau kedaluwarsa")

    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User tidak ditemukan")

    return user


# ===== ENDPOINT: AUTENTIKASI =====

@app.post("/auth/signup", response_model=Token)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")

    new_user = User(email=user_data.email, hashed_password=hash_password(user_data.password))
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    return {"access_token": token, "user": new_user}


@app.post("/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Email atau password salah")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "user": user}


@app.get("/auth/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user


# ===== ENDPOINT: UMUM =====

@app.get("/")
def root():
    return {"message": "Stunting & Nutrition Status Classifier API", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


# ===== ENDPOINT: KLASIFIKASI GIZI =====

class PredictionInput(BaseModel):
    age_months: int = Field(..., ge=0, le=60, description="Usia anak dalam bulan (0-60)")
    gender: Literal[0, 1] = Field(..., description="Jenis kelamin (0 atau 1, sesuai encoding dataset)")
    weight_kg: float = Field(..., gt=0, lt=30, description="Berat badan anak dalam kg")
    height_cm: float = Field(..., gt=0, lt=130, description="Tinggi badan anak dalam cm")


@app.post("/predict")
def predict(input_data: PredictionInput):
    """
    Prediksi 3 indikator gizi sekaligus (stunting, underweight, wasting),
    masing-masing dengan penjelasan versi awam dan klinis.
    """
    try:
        result = explain_prediction(
            age_months=input_data.age_months,
            gender=input_data.gender,
            weight_kg=input_data.weight_kg,
            height_cm=input_data.height_cm
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===== ENDPOINT: FORECASTING PERTUMBUHAN =====

@app.get("/children")
def list_children():
    """Daftar anak (anonim) yang punya data cukup untuk forecasting pertumbuhan."""
    df = load_longitudinal_data()
    children = get_available_children(df)
    return {"children": children}


@app.get("/forecast/{anon_id}")
def get_forecast(anon_id: str, metric: str = "tinggi", periods: int = 3):
    """
    Forecast pertumbuhan anak tertentu untuk metrik tertentu.
    metric: 'berat', 'tinggi', atau 'lingkar_kepala'
    periods: jumlah bulan ke depan yang diprediksi
    """
    try:
        result = forecast_growth(anon_id, metric, periods_months=periods)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))