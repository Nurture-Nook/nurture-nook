from ..models import Message

def format_history(messages: list[Message]) -> list[dict]:
    return [
        {
            "role": "user" if msg.sender == "user" else "model",
            "parts": ["msg.content"]
        }
        for msg in messages
    ]
