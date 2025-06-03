FROM python:3.10
WORKDIR /app
COPY runner.py .
RUN pip3 install --break-system-packages flask
EXPOSE 5001
CMD ["python", "runner.py"]
