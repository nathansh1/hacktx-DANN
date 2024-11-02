import requests
from flask import Flask, request, jsonify
from LLMCall import get_next_challenge
from CodingChallenges import ChallengeManager, CodingChallenge, Difficulty

app = Flask(__name__)
challenge_manager = ChallengeManager()

@app.route("/api/submit_code", methods=["POST"])
def submit_code():
    data = request.get_json()
    code = data.get("code")
    attempts = data.get("attempts", 1)
    efficiency = data.get("efficiency", 1)

    # Compile and check code (simplified for demonstration)
    compilation_result = {"success": True, "output": "Sample output"}

    # Check if the code was correct and efficient
    if compilation_result["success"]:
        # Use LLM to get next recommended problem
        recommended_difficulty = get_next_challenge(Difficulty.MEDIUM, attempts, efficiency)
        next_challenge = challenge_manager.get_challenge(Difficulty[recommended_difficulty.upper()])
        return jsonify({
            "status": "success",
            "message": "Code received",
            "next_challenge": next_challenge.props
        })
    else:
        return jsonify({"status": "error", "message": "Compilation failed"}), 400

if __name__ == "__main__":
    app.run(debug=True)