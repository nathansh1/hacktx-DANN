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

    # Define file names based on language
    file_name = {
        "python": "temp_code.py",
        "javascript": "temp_code.js",
        "cpp": "temp_code.cpp",
        "java": "TempCode.java"
    }

    # Check if the language is supported
    if language not in file_name:
        return {"success": False, "error": f"Unsupported language: {language}"}

    # Write the code to the appropriate file
    with open(file_name[language], "w") as file:
        file.write(code)

    try:
        if language == "cpp":
            # Compile C++ code
            compile_process = subprocess.run(
                ["g++", file_name["cpp"], "-o", "temp_code.out"],
                capture_output=True,
                text=True
            )
            print("C++ compile return code:", compile_process.returncode)
            print("C++ compile stderr:", compile_process.stderr)
            if compile_process.returncode != 0:
                return {"success": False, "error": compile_process.stderr}

            # Run compiled C++ binary
            result = subprocess.run(
                ["./temp_code.out"],
                capture_output=True,
                text=True,
                timeout=5
            )
        
        elif language == "java":
            # Compile Java code
            compile_process = subprocess.run(
                ["javac", file_name["java"]],
                capture_output=True,
                text=True
            )
            print("Java compile return code:", compile_process.returncode)
            print("Java compile stderr:", compile_process.stderr)
            if compile_process.returncode != 0:
                return {"success": False, "error": compile_process.stderr}

            # Run compiled Java class
            result = subprocess.run(
                ["java", "TempCode"],
                capture_output=True,
                text=True,
                timeout=5
            )

        else:
            # Run interpreted languages (Python, JavaScript) directly
            result = subprocess.run(
                ["python3", file_name["python"]] if language == "python" else ["node", file_name["javascript"]],
                capture_output=True,
                text=True,
                timeout=5
            )

        # Debugging statements to verify the result
        print(f"{language} execution return code:", result.returncode)
        print(f"{language} execution stdout:", result.stdout)
        print(f"{language} execution stderr:", result.stderr)

        # Check runtime errors for all languages
        if result.returncode != 0:
            return {"success": False, "error": result.stderr}

        # If successful, return the output
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
    # Read the CSV file to retrieve problems
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

if __name__ == "__main__":
    app.run(debug=True)
@app.route("/api/submit_code", methods=["POST"])
def submit_code():
    data = request.get_json()
    code = data.get("code")
    language = data.get("language") 

    # Compile and check code
    compilation_result = execute_code(code, language)
    # Check if the code executed successfully
    if compilation_result["success"]:
        # If successful, proceed with judging efficiency and recommending the next challenge
        #efficiency = judge_efficiency(code)
        #recommended_difficulty = get_next_challenge(Difficulty.MEDIUM, attempts, efficiency, "General")
        #attempts += 1
        #next_challenge = challenge_manager.get_challenge(Difficulty[recommended_difficulty.upper()])

        return jsonify({
            "status": "success",
            "message": "Code executed",
            "output": compilation_result["output"]#,
            #"next_challenge": next_challenge.props
        })
    else:
        # If there was a compilation or runtime error, return an error message
        return jsonify({
            "status": "error",
            "message": "Compilation or execution failed",
            "error": compilation_result["error"]
        }), 400
    


if __name__ == "__main__":
    app.run(debug=True)


