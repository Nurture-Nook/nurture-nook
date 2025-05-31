import os
import resend
from dotenv import load_dotenv
from datetime import datetime, timedelta
from utils.auth import generate_token, hash_token
from models import User

load_dotenv()

resend.api_key = os.getenv('RESEND_API_KEY')

def send_verification(username: str, user_email: str, purpose: str, token: str):
    subject = ""
    message = ""

    if purpose == "email":
        subject = "Verify Your Email Address | Nurture Nook"
        message = "A request has been sent to verify your email address."
    elif purpose == "deletion":
        subject = "Delete Your Account | Nurture Nook"
        message = "A request has been sent to delete your account."

    params: resend.Emails.SendParams = {
        "from": "Nurture Nook <%s>" % os.getenv('SENDER_EMAIL'),
        "to": ["%s"] % user_email,
        "subject": "%s" % subject,
        "html": f"""
            <p>Hello { username }</p>,

            <p>{ message }</p>
            
            <p>Your verification code is { token }.</p>

            <p>This code will expire in 15 minutes.</p>

            <p>Sincerely,<br>Nurture Nook</p>
        """
    }

    email = resend.Emails.send(params)

    if not email:
        raise Exception('Failed to send email')
