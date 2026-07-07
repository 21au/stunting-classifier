from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from src.explain import explain_prediction

app = FastAPI(
    title="Stunting Risk Classifier API",
    description="API untuk prediksi status gizi balita berdasarkan usia, gender, dan tinggi badan, dilengkapi penjelasan SHAP.",
    version="1.0.0"
)


class PredictionInput(BaseModel):
    age_months: int = Field(..., ge=0, le=60, description="Usia anak dalam bulan (0-60)")
    gender: Literal["laki-laki", "perempuan"] = Field(..., description="Jenis kelamin anak")
    height_cm: float = Field(..., gt=0, lt=150, description="Tinggi badan anak dalam cm")


class PredictionOutput(BaseModel):
    prediction: str
    probabilities: dict
    explanation: list


@app.get("/")
def root():
    return {
        "message": "Stunting Risk Classifier API",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictionOutput)
def predict(input_data: PredictionInput):
    """
    Prediksi status gizi anak berdasarkan usia, gender, dan tinggi badan.
    Return prediksi, probabilitas tiap kelas, dan penjelasan SHAP.
    """
    try:
        result = explain_prediction(
            age_months=input_data.age_months,
            gender=input_data.gender,
            height_cm=input_data.height_cm
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))