from flask import Flask, request
import subprocess

app = Flask(__name__)

@app.route('/run', methods=['POST'])
def run():
    code = request.json.get('code')
    with open("Main.java", "w") as f:
        f.write(code)
    compile = subprocess.run(['javac', 'Main.java'], capture_output=True, text=True)
    if compile.returncode != 0:
        return {'output': '', 'error': compile.stderr}
    result = subprocess.run(['java', 'Main'], capture_output=True, text=True)
    return {'output': result.stdout, 'error': result.stderr}

app.run(host='0.0.0.0', port=5003)
