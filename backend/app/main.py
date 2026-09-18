from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os

app = FastAPI(title="AI Analytics API")

# Allow React frontend to communicate with the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace "*" with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Define the expected input payload using Pydantic for validation
class PropertyFeatures(BaseModel):
    rooms: int
    age_years: int

# Load model at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model/house_predictor.joblib")

try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

@app.post("/predict")
def predict_price(features: PropertyFeatures):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    # Format input for scikit-learn
    input_data = [[features.rooms, features.age_years]]
    prediction = model.predict(input_data)[0]
    
    return {
        "predicted_price": round(prediction, 2),
        "features_used": features.model_dump()
    }
    
@app.get("/health")
def health_check():
    return {"status": "healthy"}