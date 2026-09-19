FROM python:3.11-slim

# Set the working directory
WORKDIR /code

# Copy requirements first to leverage Docker layer caching
COPY ./requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy application code and serialized model
COPY ./app /code/app

# Use exec form for CMD to allow proper shutdown
CMD ["fastapi", "run", "app/main.py", "--port", "80"]