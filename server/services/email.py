import os
import resend
from dotenv import load_dotenv

load_dotenv()

# Get API key
resend.api_key = os.getenv('RESEND_API_KEY')

# Check if we're in development mode
DEV_MODE = os.getenv('DEV_MODE', 'false').lower() == 'true'

def send_verification(username: str, user_email: str, purpose: str, token: str):
    subject = ""
    message = ""

    if purpose == "email":
        subject = "Verify Your Email Address | Nurture Nook"
        message = "A request has been sent to verify your email address."
    elif purpose == "deletion":
        subject = "Delete Your Account | Nurture Nook"
        message = "A request has been sent to delete your account."

    # Format the email content
    email_content = f"""
        <p>Hello {username}</p>

        <p>{message}</p>
        
        <p>Your verification code is {token}.</p>

        <p>This code will expire in 15 minutes.</p>

        <p>Sincerely,<br>Nurture Nook</p>
    """

    # In development mode, just print the email and return success
    if DEV_MODE:
        print("\n=== DEVELOPMENT MODE: Email Not Actually Sent ===")
        print(f"To: {user_email}")
        print(f"Subject: {subject}")
        print(f"Content: {email_content}")
        print("================================================\n")
        return {"id": "dev-mode-email-id"}

    # In production, use Resend
    params: resend.Emails.SendParams = {
        "from": f"Nurture Nook <{os.getenv('SENDER_EMAIL')}>",
        "to": [user_email],
        "subject": subject,
        "html": email_content
    }

    email = resend.Emails.send(params)

    if not email:
        raise Exception("Failed to send email")
    
    return email
