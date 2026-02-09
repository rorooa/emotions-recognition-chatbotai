from fastapi import WebSocket
from emotion import detect_emotion_from_image
from emotion_smoothing import smooth_emotion

async def emotion_socket(ws: WebSocket):
    await ws.accept()

    try:
        while True:
            data = await ws.receive_json()
            image = data["image"]

            # 1️⃣ Detect raw emotion
            emotion = detect_emotion_from_image(image)

            # 2️⃣ Smooth emotion (IMPORTANT)
            emotion = smooth_emotion(emotion)

            # 3️⃣ Send stable emotion to frontend
            await ws.send_json({
                "emotion": emotion
            })
    except Exception as e:
        print("WebSocket closed:", e)
        await ws.close()
