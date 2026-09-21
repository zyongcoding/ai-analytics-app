import pandas as pd

#Load the original parquet file
df = pd.read_parquet('cars_reference.parquet')

# Ensure titles are clean strings
df['Title'] = df['Title'].astype(str).str.strip()

# Define the multi-word brands
MULTI_WORD_BRANDS = [
    'Rolls-Royce', 'Rolls Royce', 
    'Aston Martin', 
    'Land Rover', 
    'Alfa Romeo', 
    'Mercedes-Benz', 'Mercedes Benz'
]

def extract_brand(title):
    title_lower = title.lower()
    
    for brand in MULTI_WORD_BRANDS:
        if title_lower.startswith(brand.lower()):
            if "rolls" in brand.lower(): return "Rolls-Royce"
            if "mercedes" in brand.lower(): return "Mercedes-Benz"
            return brand
            
    return title.split(' ')[0]

# Apply the extraction
df['Brand'] = df['Title'].apply(extract_brand)

# Filter brands and set minimum threshold
MINIMUM_CARS = 15

# Count how many cars exist for each brand
brand_counts = df['Brand'].value_counts()

# Get a list of the popular brands that meet the threshold
popular_brands = brand_counts[brand_counts >= MINIMUM_CARS].index

# Keep only the rows where the brand is in that popular list
df_filtered = df[df['Brand'].isin(popular_brands)]

# Export to CSV
df_filtered.to_csv('cars_data_clean.csv', index=False)

print(f"Data cleaned! Removed obscure brands.")
print(f"Dataset reduced from {len(df)} to {len(df_filtered)} listings.")