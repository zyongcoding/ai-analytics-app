import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI()

# Allow both standard Vite ports
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,  # This MUST be False when using a wildcard origin
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# AZURE PRE-FLIGHT: Robust absolute paths for Linux/Windows
# This ensures it finds the files in the parent 'backend' folder
# ---------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

model = joblib.load(os.path.join(BASE_DIR, "car_price_model.pkl"))
nn = joblib.load(os.path.join(BASE_DIR, "car_nn_model.pkl"))
prep = joblib.load(os.path.join(BASE_DIR, "car_preprocessor.pkl"))
ref_df = pd.read_parquet(os.path.join(BASE_DIR, "cars_reference.parquet"))

# Match the React Frontend payload exactly
class CarQuery(BaseModel):
    brand: str
    model: str
    year: int
    mileage: float
    asking_price: float | None = None

@app.post("/analyze")
def analyze_car(query: CarQuery):
    # Map frontend data to the ML model's expected columns
    # We supply reasonable defaults for missing features to prevent crashes
    input_df = pd.DataFrame([{
        "Brand": query.brand.capitalize(),
        "Year": query.year,
        "Engine Capacity": 1600.0, 
        "Mileage/Km": query.mileage,
        "Vehicle Type": "Mid-Sized Sedan" 
    }])
    
    # 1. Price Valuation
    estimated_price = float(model.predict(input_df)[0])
    
    # 2. Deal Assessment (Matching React UI expected exact strings)
    deal_rating = "Fair"
    delta_pct = 0.0
    if query.asking_price:
        delta_pct = round(((query.asking_price - estimated_price) / estimated_price) * 100, 2)
        if delta_pct <= -7.0:
            deal_rating = "Great"
        elif delta_pct >= 7.0:
            deal_rating = "Overpriced"

    # 3. Find 5 Similar Cars (Formatting for React UI mapping)
    transformed_vec = prep.transform(input_df)
    _, indices = nn.kneighbors(transformed_vec)
    similar_indices = [idx for idx in indices[0] if idx < len(ref_df)][0:5]
    
    raw_similar = ref_df.iloc[similar_indices]
    similar_records = []
    
    for _, row in raw_similar.iterrows():
        similar_records.append({
            "brand": row.get("Brand", query.brand),
            "model": str(row.get("Title", "Unknown"))[:25], # Truncate long titles
            "year": int(row.get("Year", query.year)),
            "mileage": float(row.get("Mileage/Km", 0)),
            "price": float(row.get("Price", 0))
        })

    return {
        "estimated_price": round(estimated_price, 2),
        "deal_rating": deal_rating,
        "similar_cars": similar_records
    }