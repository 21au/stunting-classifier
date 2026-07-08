from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal
import sys
import os
from src.prophet_forecast import get_available_children, forecast_growth, load_longitudinal_data

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.explain import explain_prediction

app = FastAPI(
    title="Stunting & Nutrition Status Classifier API",
    description="API untuk klasifikasi status gizi balita (stunting, underweight, wasting) dengan penjelasan ganda: awam dan klinis.",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionInput(BaseModel):
    age_months: int = Field(..., ge=0, le=60, description="Usia anak dalam bulan (0-60)")
    gender: Literal[0, 1] = Field(..., description="Jenis kelamin (0 atau 1, sesuai encoding dataset)")
    weight_kg: float = Field(..., gt=0, lt=30, description="Berat badan anak dalam kg")
    height_cm: float = Field(..., gt=0, lt=130, description="Tinggi badan anak dalam cm")


@app.get("/")
def root():
    return {"message": "Stunting & Nutrition Status Classifier API", "docs": "/docs", "health": "/health"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


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