import os
import json
from groq import Groq

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def generate_llm_reply(name, emotion, user_text):
    system_prompt = (
        "You are an emotionally intelligent AI companion. "
        f"User: {name}, Emotion: {emotion}. "
        "Respond naturally and empathetically. "
        "If the user is sad, angry, or needs a boost, recommend a song, a funny video, or a mini-game. "
        "Return ONLY valid JSON with this structure: "
        "{ \"reply\": \"spoken response\", \"recommendation\": { \"type\": \"song\"|\"video\"|\"game\"|\"none\", \"query\": \"search term or title\" } }"
        "keep the reply short (under 2 sentences)."
    )

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_text}
            ],
            max_tokens=200,
            temperature=0.7,
            response_format={"type": "json_object"} 
        )
        
        content = response.choices[0].message.content
        return json.loads(content)
        
    except Exception as e:
        print("LLM Error:", e)
        return {
            "reply": "I'm having a bit of trouble thinking right now, but I'm here for you.",
            "recommendation": {"type": "none", "query": ""}
        }
