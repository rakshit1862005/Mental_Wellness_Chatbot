# 🧠 MindWell – AI Mental Wellness Assistant  
### *Emotion Analysis • Crisis Detection • Mood Tracking • Emergency SMS Alerts*

MindWell is a full-stack mental-wellness chatbot that uses **Next.js**, **FastAPI**, **Transformer NLP models**, and **MongoDB** to provide emotional support, track user mental state, and trigger emergency alerts when needed.

It uses **Gemini AI** for conversational responses and **Twilio** to send SMS alerts to a user’s trusted contact when crisis levels exceed safe limits.

---

## 🚀 Features

### 🧠 AI Emotional Understanding  
MindWell analyzes every user message with:
- Intent Classification (`mindpadi/intent_classifier`)
- Emotion Detection (`j-hartmann/emotion-english-distilroberta-base`)
- Mood Rating (1–10)
- Crisis Score (0–100)
- Context extraction

---

### 💬 Multi-Session Chat UI (Next.js)
- Clean and modern chat interface  
- Multiple chat sessions stored in MongoDB  
- Gemini-powered assistant  
- Auto-scroll, typing indicators, responsive layout  

---

### 📉 Mental State Tracking  
MindWell stores:
- Mood history  
- Crisis history  
- Message-level emotional metadata  

Enabling future dashboards/analytics.

---

### 🚨 Emergency SMS Alerts (Twilio)
If **crisisScore ≥ 80**, the backend automatically sends an SMS to the user’s emergency contact.

Example alert:

```

⚠️ Emergency Alert for Rakshit.
Crisis Score: 90/100.
Message: "I don’t want to continue anymore."
Please check on them immediately.

```

---

## 🗂 Project Structure

```

Mental_Wellness_Chatbot/
│
├── frontend/              # Next.js App (Chat UI, Login, Signup)
│   ├── app/
│   ├── components/
│   ├── pages/
│   └── ...
│
├── Models/                # FastAPI Backend
│   ├── app.py             # Main API server (analyze route)
│   ├── twilio_alert.py    # SMS sending logic
│   ├── intent_labels.py   # Intent list for classifier
│   └── requirements.txt
│
└── README.md

````

---

# 🛠️ Setup Instructions (Complete Guide)

## 1️⃣ Clone the repo
```bash
git clone https://github.com/rakshit1862005/Mental_Wellness_Chatbot.git
cd Mental_Wellness_Chatbot
````

---

# ⚙️ Backend Setup (FastAPI)

## 2️⃣ Navigate to backend

```bash
cd Models
```

## 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

## 4️⃣ Create `.env` file in `Models/`:

```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

## 5️⃣ Run FastAPI server

```bash
uvicorn app:app --reload
```

Backend runs on:

```
http://localhost:8000
```

---

# 🌐 Frontend Setup (Next.js 14+)

## 6️⃣ Navigate to frontend

```bash
cd ../frontend
```

## 7️⃣ Install deps

```bash
npm install
```

## 8️⃣ Create `.env.local`:

```
GEMINI_API_KEY=your_key_here
MONGO_URL=your_mongodb_url
```

## 9️⃣ Run Next.js app

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

# 🗄 MongoDB Structure

### 📌 Database 1: `Authentication`

Collection: `users`

Example document:

```json
{
  "name": "Rakshit",
  "email": "rakshit1862005@gmail.com",
  "closecon": "6284117279"
}
```

### 📌 Database 2: `mental_wellness`

Collections:

* `chat` – Message history
* `mood` – Mood + crisis history

---

# 🔧 Environment Variables Summary

### Frontend (`.env.local`)

```
GEMINI_API_KEY=
MONGO_URL=
```

### Backend (`Models/.env`)

```
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
```

---

# 🧪 Testing the System

### ✔ Chat normally → Gemini responds

### ✔ Send emotional text → NLP analysis

### ✔ Crisis-like message (“I want to die”) →

* Crisis score computed
* SMS sent to emergency contact
* Debug logs printed in FastAPI

---

# 📌 Technologies Used

| Layer    | Technologies             |
| -------- | ------------------------ |
| Frontend | Next.js, React           |
| AI Chat  | Gemini API               |
| NLP      | HuggingFace Transformers |
| Backend  | FastAPI, Python          |
| Database | MongoDB Atlas            |
| Alerts   | Twilio SMS               |
| Styling  | CSS Modules              |

---

# 🧭 Future Enhancements

* Mood graph dashboard
* Secure JWT authentication
* Voice support
* Therapist handoff module
* Safety plan recommendations

---

# 🧑‍💻 Author

**Rakshit**
AI Developer | Mental Wellness Tools | Full-stack Engineer

GitHub: [https://github.com/rakshit1862005](https://github.com/rakshit1862005)

---

# 🎉 Final Notes

This project integrates **AI**, **mental health safety**, and **real-world emergency alert systems** into a seamless end-to-end platform.

If you like this project, star ⭐ the repo!

