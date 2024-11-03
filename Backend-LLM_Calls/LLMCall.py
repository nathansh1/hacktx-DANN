import os
import json
from llamaapi import LlamaAPI
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("LLAMA_API_KEY")
llama = LlamaAPI(API_KEY)

def judge_efficiency(code):
    """Calls the LLM to judge the efficiency of the code."""
    user_message = (
        f"""This is the code from the user. Judge its efficiency from 1 to 100. ONLY OUTPUT THE NUMBER"""
    )

    api_request_json = {
        "model": "llama3-8b",
        "messages": [{"role": "user", "content": user_message}],
        "stream": False
    }

    response = llama.run(api_request_json)
    efficiency = response.json().get("choices", [{}])[0].get("message", {}).get("content")

    # Convert response to integer if it's a valid numeric string
    return int(efficiency) if efficiency and efficiency.isdigit() else 50


def get_next_challenge(difficulty, attempts, efficiency, category):
    """Calls the LLM to recommend the next challenge."""
    user_message = (
        f"""The user attempted a {difficulty.name} problem with {attempts} attempts, {category} category, and efficiency score {efficiency}.
        Recommend an easier or harder problem based on their performance. You will likely want to recommend a different category if they
        do well, and a similar and easier category if they did bad."""
    )

    api_request_json = {
        "model": "llama3-8b",
        "messages": [{"role": "user", "content": user_message}],
        "stream": False
    }

    response = llama.run(api_request_json)
    return response.json().get("recommendation")