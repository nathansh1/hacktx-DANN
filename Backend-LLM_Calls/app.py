from flask import Flask, request, jsonify, send_from_directory
from LLMCall import get_next_challenge, judge_efficiency, get_Advice
from CodingChallenges import ChallengeManager, CodingChallenges, Difficulty
import subprocess
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS

app = Flask(__name__)
challenge_manager = ChallengeManager()
CORS(app)

cred = credentials.Certificate("firebaseAPI.json")  # Replace with actual JSON file path
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()
testsPassed = 0

# Retrieve a specific document and get its test cases
doc_ref = db.collection("problems").document("HashTable1")
tests = doc_ref.get().to_dict().get("Tests", [])
topics = doc_ref.get().to_dict().get("Topics", [])
diff = doc_ref.get().to_dict().get("Difficulty", [])
def get_difficulty(level: str) -> Difficulty:
    switch = {
        "Easy": Difficulty.EASY,
        "Medium": Difficulty.MEDIUM,
        "Hard": Difficulty.HARD
    }
    return switch.get(level, None)
diff = get_difficulty(diff)
def wrap_python_code_with_main(user_code, input_variable):
    """
    Wrap the user's code in a main function to allow test execution.
    Expecting that the user's code has a function named 'solve'.
    """
    wrapped_code = f"""
{user_code}

if __name__ == "__main__":
    # Execute the user's function with the given input
    solution = Solution()
    result = solution.{input_variable}
    print(result)
"""
    return wrapped_code

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

    # Write code to temporary file
    with open(file_name[language], "w") as file:
        file.write(code)

    try:
        # Language-specific execution commands
        if language == "cpp":
            compile_process = subprocess.run(["g++", file_name["cpp"], "-o", "temp_code.out"], capture_output=True, text=True)
            if compile_process.returncode != 0:
                return {"success": False, "error": compile_process.stderr}
            result = subprocess.run(["./temp_code.out"], capture_output=True, text=True, timeout=5)
        
        elif language == "java":
            compile_process = subprocess.run(["javac", file_name["java"]], capture_output=True, text=True)
            if compile_process.returncode != 0:
                return {"success": False, "error": compile_process.stderr}
            result = subprocess.run(["java", "TempCode"], capture_output=True, text=True, timeout=5)

        else:  # Python and JavaScript
            result = subprocess.run(
                ["python3", file_name["python"]] if language == "python" else ["node", file_name["javascript"]],
                capture_output=True, text=True, timeout=5
            )

        if result.returncode != 0:
            return {"success": False, "error": result.stderr}

        return {"success": True, "output": result.stdout.strip()}

    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Execution timed out"}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.route("/api/submit_code", methods=["POST"])
def submit_code():
    attempts = 0
    data = request.get_json()
    code = data.get("code")
    language = data.get("language")

    # Run each test case
    passed_count = 0
    failed_cases = []
    for test_case in tests:
        input_value = test_case.get('input')
        expected_output = test_case.get('expectedOutput')

        # Wrap user code with main function for each test case
        wrapped_code = wrap_python_code_with_main(code, input_value)
        execution_result = execute_code(wrapped_code, language)

        # Debug: Log each execution result and comparison
        print(execution_result['success'])
        if execution_result["success"]:
            actual_output = execution_result["output"].strip()
            print(f"Test Input: {input_value}")  
            print(f"Expected Output: {expected_output}")  
            print(f"Actual Output: {actual_output}")  

            if actual_output == expected_output:
                passed_count += 1
            else:
                failed_cases.append({
                    "input": input_value,
                    "expected_output": expected_output,
                    "actual_output": actual_output,
                    "status": "failed"
                })
                # Increase attempts on failure and get advice
                attempts += 1
                get_Advice(code)  # Call LLM for assistance

        else:
            # Count failure if code execution failed
            failed_cases.append({
                "input": input_value,
                "expected_output": expected_output,
                "actual_output": execution_result["error"],
                "status": "error"
            })
            attempts = attempts + 1
            get_Advice(code)  # Call LLM for assistance on error

    # Check if all test cases passed and call for next challenge if they did
    if passed_count == len(tests):
        get_next_challenge(diff, attempts, judge_efficiency(code), topics)
    # Return results to the frontend
    return jsonify({
        "status": "success" if passed_count == len(tests) else "error",
        "passed_count": passed_count,
        "total_cases": len(tests),
        "failed_cases": failed_cases,
        "message": f"{passed_count} out of {len(tests)} test cases passed."
    })

if __name__ == "__main__":
    app.run(debug=True)