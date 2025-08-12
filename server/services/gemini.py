from google.generativeai import GenerativeModel
from chatbot_instructions import SYSTEM_PROMPT
from typing import List, Dict

model = GenerativeModel("gemini-pro")

def generate_reply(chat_history: List[Dict[str, str]], user_input: str) -> str:
    messages = [SYSTEM_PROMPT] + chat_history + [
        {"role": "user", "parts": [user_input]}
    ]
    
    response = model.generate_content(messages)
    return getattr(response, "text", "").strip()
