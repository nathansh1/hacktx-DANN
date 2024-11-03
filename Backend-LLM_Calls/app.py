from flask import Flask, request, jsonify, send_from_directory
from LLMCall import get_next_challenge, judge_efficiency
from CodingChallenges import ChallengeManager, CodingChallenges, Difficulty
import subprocess
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
challenge_manager = ChallengeManager()
CORS(app)
attempts = 0

def execute_code(code, language):
    """Executes code in the specified language and returns the output or an error with a success flag."""
    file_name = {
        "python": "temp_code.py",
        "javascript": "temp_code.js",
        "cpp": "temp_code.cpp",
        "java": "TempCode.java"
    }

    if language not in file_name:
        return {"success": False, "error": f"Unsupported language: {language}"}

    with open(file_name[language], "w") as file:
        file.write(code)

    try:
        if language == "cpp":
            compile_process = subprocess.run(
                ["g++", file_name["cpp"], "-o", "temp_code.out"],
                capture_output=True,
                text=True
            )
            if compile_process.returncode != 0:
                return {"success": False, "error": compile_process.stderr}

            result = subprocess.run(
                ["./temp_code.out"],
                capture_output=True,
                text=True,
                timeout=5
            )
        
        elif language == "java":
            compile_process = subprocess.run(
                ["javac", file_name["java"]],
                capture_output=True,
                text=True
            )
            if compile_process.returncode != 0:
                return {"success": False, "error": compile_process.stderr}

            result = subprocess.run(
                ["java", "TempCode"],
                capture_output=True,
                text=True,
                timeout=5
            )

        else:
            result = subprocess.run(
                ["python3", file_name["python"]] if language == "python" else ["node", file_name["javascript"]],
                capture_output=True,
                text=True,
                timeout=5
            )

        if result.returncode != 0:
            return {"success": False, "error": result.stderr}

        output = result.stdout if result.stdout else "No output"
        return {"success": True, "output": output}

    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Execution timed out"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.route("/")
def index():
    return send_from_directory("static", "test.html")

@app.route("/api/problems", methods=["GET"])
def get_problems():
    df = pd.read_csv("problems.csv")
    problems = []

    for _, row in df.iterrows():
        problem = {
            "title": row["Title"],
            "description": row["Description"],
            "code": row["Code"]
        }
        problems.append(problem)
    
    return jsonify(problems)

@app.route("/api/submit_code", methods=["POST"])
def submit_code():
    data = request.get_json()
    code = data.get("code")
    language = data.get("language")

    compilation_result = execute_code(code, language)

    if compilation_result["success"]:
        return jsonify({
            "status": "success",
            "message": "Code executed",
            "output": compilation_result["output"]
        })
    else:
        return jsonify({
            "status": "error",
            "message": "Compilation or execution failed",
            "error": compilation_result["error"]
        }), 400

# Keep only one if __name__ == "__main__": block
if __name__ == "__main__":
    app.run(debug=True)