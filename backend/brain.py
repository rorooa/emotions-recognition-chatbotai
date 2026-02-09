def ai_response(name, emotion, user_text=None):

    if emotion == "sad":
        if not user_text:
            return f"Hey {name}, you look sad today. Can I know the reason?"
        return f"I understand, {name}. Let me try to cheer you up 😊"

    if emotion == "happy":
        return f"Wow {name}, you look happy! Want to play a game?"

    if emotion == "angry":
        return f"{name}, let’s slow things down together. Take a breath."

    return f"I’m listening, {name}. Tell me more."
