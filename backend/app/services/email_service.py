import logging
import smtplib
import asyncio
import datetime
from email.message import EmailMessage

from app.core.config import settings

logger = logging.getLogger(__name__)

class EmailService:
    def _send_email_sync(self, email_to: str, subject: str, html_content: str) -> None:
        if not settings.SMTP_HOST:
            logger.warning("SMTP_HOST is not set. Email will not be sent.")
            return

        message = EmailMessage()
        message["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL or settings.SMTP_USER}>"
        message["To"] = email_to
        message["Subject"] = subject
        message.set_content(html_content, subtype="html")

        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.ehlo()
                if settings.SMTP_TLS:
                    server.starttls()
                if settings.SMTP_USER and settings.SMTP_PASSWORD:
                    # Remove spaces from Google app passwords just in case
                    pwd = settings.SMTP_PASSWORD.replace(" ", "")
                    server.login(settings.SMTP_USER, pwd)
                server.send_message(message)
            logger.info(f"Successfully sent email to {email_to}")
        except Exception as e:
            logger.error(f"Error sending email to {email_to}: {e}")

    async def send_reset_password_email(self, email: str, token: str) -> None:
        """
        Send a password reset email.
        """
        base_url = settings.FRONTEND_URL.split(",")[0].strip()
        reset_link = f"{base_url}/reset-password?token={token}"
        
        # Always log in development for debugging
        print("=" * 40)
        print(f"PASSWORD RESET EMAIL TO: {email}")
        print(f"LINK: {reset_link}")
        print("=" * 40)
        
        if settings.SMTP_HOST:
            subject = f"{settings.PROJECT_NAME} - Password Recovery"
            year = datetime.datetime.now().year
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body {{
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background-color: #f4f4f5;
                        color: #18181b;
                        margin: 0;
                        padding: 0;
                    }}
                    .container {{
                        max-width: 600px;
                        margin: 40px auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                        overflow: hidden;
                    }}
                    .header {{
                        background-color: #2563eb;
                        color: #ffffff;
                        padding: 24px;
                        text-align: center;
                    }}
                    .header h1 {{
                        margin: 0;
                        font-size: 24px;
                        font-weight: 600;
                    }}
                    .content {{
                        padding: 32px 24px;
                    }}
                    .content h2 {{
                        font-size: 20px;
                        margin-top: 0;
                        color: #18181b;
                    }}
                    .content p {{
                        font-size: 16px;
                        line-height: 1.6;
                        color: #52525b;
                        margin-bottom: 24px;
                    }}
                    .button-container {{
                        text-align: center;
                        margin: 32px 0;
                    }}
                    .button {{
                        display: inline-block;
                        background-color: #2563eb;
                        color: #ffffff !important;
                        text-decoration: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        font-weight: 600;
                        font-size: 16px;
                    }}
                    .footer {{
                        background-color: #f8fafc;
                        padding: 24px;
                        text-align: center;
                        font-size: 14px;
                        color: #71717a;
                        border-top: 1px solid #e2e8f0;
                    }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>{settings.PROJECT_NAME}</h1>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>We received a request to reset the password for your {settings.PROJECT_NAME} account. If you made this request, please click the button below to set a new password:</p>
                        
                        <div class="button-container">
                            <a href="{reset_link}" class="button">Reset Password</a>
                        </div>
                        
                        <p style="margin-bottom: 0;">If you did not request a password reset, you can safely ignore this email. This link will expire in 15 minutes.</p>
                    </div>
                    <div class="footer">
                        <p>&copy; {year} {settings.PROJECT_NAME}. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            # Run the synchronous SMTP sending in a separate thread so we don't block the async event loop
            await asyncio.to_thread(self._send_email_sync, email, subject, html_content)
        else:
            logger.info("SMTP_HOST not configured. Email logged to console only.")
