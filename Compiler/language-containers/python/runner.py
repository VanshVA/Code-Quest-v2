from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route('/run', methods=['POST'])
def run():
    code = request.json.get('code')
    with open("script.py", "w") as f:
        f.write(code)
    result = subprocess.run(['python', 'script.py'], capture_output=True, text=True)
    return {'output': result.stdout, 'error': result.stderr}

app.run(host='0.0.0.0', port=5001)
