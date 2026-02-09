emotion_history = []

def store_emotion(emotion):
    emotion_history.append(emotion)

def get_recent_emotion():
    return emotion_history[-1] if emotion_history else "neutral"

def dominant_emotion():
    return max(set(emotion_history), key=emotion_history.count)
