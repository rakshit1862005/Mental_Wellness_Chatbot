import os
from twilio.rest import Client

# Load env variables
TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_NUMBER")

client = Client(TWILIO_SID, TWILIO_AUTH)

def format_indian_number(number: str):
    """
    Ensures Indian numbers always start with +91
    and strips spaces/dashes.
    """
    if not number:
        return None

    number = number.replace(" ", "").replace("-", "")

    if number.startswith("+91"):
        return number
    if number.startswith("91"):
        return "+" + number
    if number.startswith("0"):
        return "+91" + number[1:]

    return "+91" + number
        

def send_emergency_sms(to_number, message):
    try:
        formatted_to = format_indian_number(to_number)

        sms = client.messages.create(
            body=message,
            from_=TWILIO_NUMBER,
            to=formatted_to
        )

        print("SMS SENT →", sms.sid)
        return True
    except Exception as e:
        print("SMS ERROR →", e)
        return False
