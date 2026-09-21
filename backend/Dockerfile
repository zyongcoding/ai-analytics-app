# Use a lightweight Python image
FROM python:3.11-slim

# Set the working directory
WORKDIR /code

# Copy requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend files (ML models, parquet, and app code)
COPY . .

# Expose the port FastAPI runs on
EXPOSE 8000

# Start the server using Gunicorn to manage the Uvicorn worker (crucial for Azure RAM limits)
CMD ["gunicorn", "-w", "1", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "app.main:app"]