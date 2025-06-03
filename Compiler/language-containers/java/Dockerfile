FROM openjdk:17-jdk-slim
WORKDIR /app
RUN apt-get update && apt-get install -y python3 python3-venv
COPY runner.py .
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir flask
EXPOSE 5003
CMD ["python3", "runner.py"]
