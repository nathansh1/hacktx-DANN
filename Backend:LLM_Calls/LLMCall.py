import os
import json
from llamaapi import LlamaAPI
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("LLAMA_API_KEY")
llama = LlamaAPI(API_KEY)

def get_next_challenge(difficulty, attempts, efficiency, category, code):
    """Calls the LLM to recommend the next challenge."""
    user_message = (
        f"""The user attempted a {difficulty.name} problem with {attempts} attempts, {category} category, and efficiency score {efficiency}.
        Recommend an easier or harder problem based on their performance. You will likely want to recommend a different category if they
        do well, and a similar and easier category if they did bad. This is their code: {code}"""
    )

    api_request_json = {
        "model": "llama3-8b",
        "messages": [{"role": "user", "content": user_message}],
        "stream": False
    }

    response = llama.run(api_request_json)
    return response.json().get("recommendation")