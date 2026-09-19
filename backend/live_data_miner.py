import requests
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import joblib
import os
from datetime import datetime

print("Initiating live data mining pipeline...")

# Mine live housing transaction data via public API
url = "https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc&limit=5000"
response = requests.get(url)
raw_data = response.json()

# Clean and engineer features with Pandas
records = raw_data['result']['records']
df = pd.DataFrame(records)

# Convert flat_type into a numeric 'rooms' feature
df['rooms'] = df['flat_type'].str.extract('(\d+)').astype(float)

# Calculate building age from lease commence date
current_year = datetime.now().year
df['age_years'] = current_year - df['lease_commence_date'].astype(int)

# Set the target prediction variable
df['price'] = df['resale_price'].astype(float)

# Drop any rows with missing data to prevent model corruption
df = df[['rooms', 'age_years', 'price']].dropna()

print(f"Data cleaned. Training model on {len(df)} real transaction records...")

# Train the model and save to the production folder
X = df[['rooms', 'age_years']]
y = df['price']

model = RandomForestRegressor(n_estimators=50, random_state=42)
model.fit(X, y)

os.makedirs('app/model', exist_ok=True)
joblib.dump(model, 'app/model/house_predictor.joblib')
print("Pipeline complete. Production model updated with live data.")