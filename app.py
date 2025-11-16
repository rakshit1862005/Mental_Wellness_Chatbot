from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F
from pymongo import MongoClient
from datetime import datetime
import uvicorn
from twilio_alert import send_emergency_sms
from intent_labels import INTENT_LABELS

# -------------------------------------------------------
# FASTAPI + CORS
# -------------------------------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------
# MONGO CONNECTION
# -------------------------------------------------------
MONGO_URI = "mongodb+srv://rakshit186005:i3MtBAMT2jMbXisu@ChatApp.il2chd5.mongodb.net/"

client = MongoClient(MONGO_URI)

# Correct DB for user info
auth_db = client["Authentication"]
user_collection = auth_db["users"]       # ✔ HAS closecon field

# Other collections (your previous ones)
wellness_db = client["mental_wellness"]
chat_collection = wellness_db["chat"]
mood_collection = wellness_db["mood"]

# -------------------------------------------------------
# LOAD MODELS
# -------------------------------------------------------
INTENT_MODEL_NAME = "mindpadi/intent_classifier"
intent_tokenizer = AutoTokenizer.from_pretrained(INTENT_MODEL_NAME)
intent_model = AutoModelForSequenceClassification.from_pretrained(INTENT_MODEL_NAME)

EMOTION_MODEL_NAME = "j-hartmann/emotion-english-distilroberta-base"
emotion_tokenizer = AutoTokenizer.from_pretrained(EMOTION_MODEL_NAME)
emotion_model = AutoModelForSequenceClassification.from_pretrained(EMOTION_MODEL_NAME)

# -------------------------------------------------------
# LABELS
# -------------------------------------------------------
EMOTION_LABELS = ["anger", "disgust", "fear", "joy", "neutral", "sadness", "surprise"]


# -------------------------------------------------------
# INPUT MODEL
# -------------------------------------------------------
class InputText(BaseModel):
    text: str
    email: str
    sessionId: str


# -------------------------------------------------------
# CLASSIFIERS
# -------------------------------------------------------
def classify_intent(text: str):
    inputs = intent_tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        logits = intent_model(**inputs).logits
    pred = torch.argmax(logits, dim=1).item()
    return INTENT_LABELS[pred] if pred < len(INTENT_LABELS) else "unknown"


def classify_emotion(text: str):
    inputs = emotion_tokenizer(text, return_tensors="pt", truncation=True)
    with torch.no_grad():
        logits = emotion_model(**inputs).logits
    pred = torch.argmax(F.softmax(logits, dim=1), dim=1).item()
    return EMOTION_LABELS[pred]


# -------------------------------------------------------
# MOOD + CRISIS SCORE
# -------------------------------------------------------
def predict_mood(text: str, emotion: str):
    t = text.lower()
    if "kill myself" in t or "suicide" in t or "want to die" in t:
        return 1
    if emotion in ["sadness", "fear"]:
        return 3
    if emotion == "neutral":
        return 5
    if emotion == "joy":
        return 8
    return 5


def text_contains_any(text: str, keywords):
    return any(k in text for k in keywords)


def predict_crisis(text: str, intent: str, mood_score: int, emotion: str):
    txt = text.lower()

    # Direct severe phrases
    high_phrases = [
        "i will kill myself", "i want to die", "end my life",
        "i'm going to kill myself", "i will jump"
    ]
    if text_contains_any(txt, high_phrases):
        return 98

    # Intent weight
    ik = intent.lower()
    if "suicide" in ik or "self-harm" in ik:
        intent_weight = 0.9
    elif "despair" in ik or "hopeless" in ik:
        intent_weight = 0.6
    else:
        intent_weight = 0.15

    mood_risk = (10 - mood_score) / 9
    emotion_risk = 0.12 if emotion in ["fear", "sadness"] else 0.02

    crisis = int((intent_weight * 0.6 + mood_risk * 0.3 + emotion_risk * 0.1) * 100)
    return max(0, min(100, crisis))


def generate_context(intent, emotion, mood, crisis):
    return f"{emotion} | intent={intent} | mood={mood}/10 | crisis={crisis}/100"


# -------------------------------------------------------
# MAIN ENDPOINT
# -------------------------------------------------------
@app.post("/analyze")
def analyze(data: InputText):

    intent = classify_intent(data.text)
    emotion = classify_emotion(data.text)
    mood = predict_mood(data.text, emotion)
    crisis = predict_crisis(data.text, intent, mood, emotion)
    context = generate_context(intent, emotion, mood, crisis)

    # Save chat
    chat_collection.insert_one({
        "email": data.email,
        "sessionId": data.sessionId,
        "text": data.text,
        "intent": intent,
        "emotion": emotion,
        "moodScore": mood,
        "crisisScore": crisis,
        "createdAt": datetime.utcnow(),
    })

    # Save mood history
    mood_collection.update_one(
        {"email": data.email},
        {"$push": {
            "moodHistory": {"score": mood, "createdAt": datetime.utcnow()},
            "crisisHistory": {"score": crisis, "createdAt": datetime.utcnow()},
        }},
        upsert=True
    )

    # -------------------------------------------------------
    # CRISIS ALERT — SEND SMS
    # -------------------------------------------------------
    if crisis >= 80:

        user = user_collection.find_one({"email": data.email})

        print("\n=== CRISIS DEBUG ===")
        print("USER FOUND:", user)

        if user:
            raw_number = user.get("closecon")  # ✔ Correct field

            print("Raw DB number:", raw_number)

            if raw_number and raw_number.strip() != "":
                number = raw_number.strip()
                if not number.startswith("+91"):
                    number = "+91" + number

                alert_body = (
                    f"⚠️ Emergency Alert for {user.get('name', 'User')}.\n"
                    f"Crisis Score: {crisis}/100.\n"
                    f"Message: '{data.text}'\n"
                    "Please check on them immediately."
                )

                print("Normalized Number:", number)
                print("SMS Body:", alert_body)
                print("Sending SMS...\n")

                send_emergency_sms(number, alert_body)
            else:
                print("❌ User has NO emergency contact. SKIPPING SMS.")

        else:
            print("❌ User not found in Authentication DB.")

    return {
        "text": data.text,
        "intent": intent,
        "emotion": emotion,
        "moodScore": mood,
        "crisisScore": crisis,
        "context": context
    }


# -------------------------------------------------------
# RUN SERVER
# -------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
