from collections import deque, Counter

# Rolling window of recent emotions
emotion_window = deque(maxlen=3)

def smooth_emotion(new_emotion: str) -> str:
    """
    Smooth emotion predictions using majority voting.
    Prevents false dominance like constant 'angry'.
    """

    if not new_emotion:
        return "neutral"

    emotion_window.append(new_emotion)

    counts = Counter(emotion_window)
    dominant_emotion, freq = counts.most_common(1)[0]

    # If emotion is not stable enough, fallback to neutral
    if freq < 2:
        return "neutral"

    return dominant_emotion
