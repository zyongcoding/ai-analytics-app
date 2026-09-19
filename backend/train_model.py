# backend/train_model.py
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

# Create dummy training data
data = pd.DataFrame({
    'rooms': [2, 3, 4, 5, 3, 4],
    'age_years': [10, 5, 20, 2, 15, 8],
    'price': [250000, 320000, 280000, 500000, 290000, 350000]
})

X = data[['rooms', 'age_years']]
y = data['price']

# Train the model
model = RandomForestRegressor(n_estimators=10, random_state=42)
model.fit(X, y)

# Save the model to model directory
os.makedirs('app/model', exist_ok=True)
joblib.dump(model, 'app/model/house_predictor.joblib')
print("Model trained and saved successfully.")