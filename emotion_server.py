from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import torch.nn.functional as F

MODEL = "j-hartmann/emotion-english-distilroberta-base"

tokenizer = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSequenceClassification.from_pretrained(MODEL)

text = "I WIll Kill Myself"
inputs = tokenizer(text, return_tensors="pt", truncation=True)
outputs = model(**inputs)

logits = outputs.logits
probs = F.softmax(logits, dim=1)
pred_id = torch.argmax(probs, dim=1).item()

labels = ["anger","disgust","fear","joy","neutral","sadness","surprise"]

print("Emotion:", labels[pred_id])
