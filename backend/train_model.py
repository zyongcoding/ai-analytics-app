import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# 1. Load data
df = pd.read_csv(r"c:\Users\Lim Zheng Yong\Downloads\processed_sgcarmart.csv")

# 2. Feature Engineering
# Extract Year from Registration Date
df['Year'] = pd.to_datetime(df['Registration Date'], errors='coerce').dt.year
# Extract Brand from Title (first word)
df['Brand'] = df['Title'].apply(lambda x: str(x).split(' ')[0] if pd.notnull(x) else 'Unknown')

# Ensure numeric columns are actually numbers
for col in ['Price', 'Engine Capacity', 'Mileage/Km']:
    df[col] = pd.to_numeric(df[col], errors='coerce')

# Drop rows with missing crucial data
df = df.dropna(subset=['Price', 'Year', 'Engine Capacity', 'Mileage/Km', 'Vehicle Type', 'Brand'])

num_cols = ["Year", "Engine Capacity", "Mileage/Km"]
cat_cols = ["Brand", "Vehicle Type"]
target = "Price"

X = df[num_cols + cat_cols]
y = df[target]

# 3. Preprocessing pipeline
preprocessor = ColumnTransformer([
    ("num", StandardScaler(), num_cols),
    ("cat", OneHotEncoder(handle_unknown="ignore"), cat_cols)
])

# 4. Train Valuation Model (Random Forest)
print("Training price model...")
regressor = Pipeline([
    ("prep", preprocessor),
    ("rf", RandomForestRegressor(n_estimators=100, random_state=42))
])
regressor.fit(X, y)

# 5. Train Similarity Engine (Nearest Neighbors)
print("Training similarity engine...")
X_transformed = preprocessor.fit_transform(X)
nn = NearestNeighbors(n_neighbors=6, metric="euclidean")
nn.fit(X_transformed)

# 6. Export artifacts
joblib.dump(regressor, "car_price_model.pkl")
joblib.dump(nn, "car_nn_model.pkl")
joblib.dump(preprocessor, "car_preprocessor.pkl")

# Save a clean reference dataframe for the API to look up similar cars
df_ref = df[['Title', 'Year', 'Mileage/Km', 'Price']].copy()
df_ref.to_parquet("cars_reference.parquet")

print("Training complete! Artifacts exported.")