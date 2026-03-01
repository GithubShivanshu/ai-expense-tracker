FROM python:3.11-slim

# Copy requirements and install them
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all code
COPY . .

# Expose port (8000 default)
EXPOSE 8000

# Run gunicorn server
CMD gunicorn "run:app" -b 0.0.0.0:${PORT:-8000}
