FROM gcc:latest
WORKDIR /app
COPY runner.py .
RUN apt-get update && apt-get install -y python3 python3-pip
RUN pip3 install --break-system-packages flask
EXPOSE 5005
CMD ["python3", "runner.py"]
