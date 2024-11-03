import os
import openai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("LLAMA_API")  # Ensure the key is set in your .env file

openai.api_key = API_KEY  # Set OpenAI API key

def get_Advice(code):
    """Calls the OpenAI API to provide a hint about the answer."""
    user_message = (
        f"This is the code from the user. Give the user a hint about the answer."
    )

    response = openai.completions.create(
        model="llama3-8b",
        messages=[{"role": "user", "content": user_message}],
    )

    # Extract content from response
    advice = response.choices[0].message.content
    return advice

def judge_efficiency(code):
    """Calls the OpenAI API to judge the efficiency of the code."""
    user_message = (
        f"This is the code from the user. Judge its efficiency from 1 to 100. ONLY OUTPUT THE NUMBER"
    )

    response = openai.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": user_message}],
    )

    # Extract efficiency score from response
    efficiency = response.choices[0].message.content
    return int(efficiency) if efficiency.isdigit() else 50

def get_next_challenge(difficulty, attempts, efficiency, categories):
    """Calls the OpenAI API to recommend the next challenge."""
    user_message = (
        f"The user attempted a {difficulty.name} problem with {attempts} attempts, {categories} categories, and efficiency score {efficiency}. "
        "Recommend an easier or harder problem based on their performance. Suggest a different category if they did well, and a similar and easier category if they did poorly."
    )

    response = openai.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": user_message}],
    )

    # Extract recommendation from response
    recommendation = response.choices[0].message.content
    return recommendation
