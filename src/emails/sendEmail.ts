import dotenv from 'dotenv';
dotenv.config();

interface Props {
  to: string | string[];
  from: string;
  subject: string;
  body: string;
}

export async function sendEmail({to, from, subject, body}: Props) {
  
  if (process.env.EMAIL_API_KEY === undefined) {
    console.error('No email API key found. Please set the EMAIL_API_KEY environment variable.');
    return false;
  }

  try {
    console.log("Sending Email from: ", from, " to: ", to, " subject: ", subject);
    await fetch('https://api.useplunk.com/v1/send', {
      method: 'POST',
      body: JSON.stringify({
        to: to,
        from: from,
        subject: subject,
        body: body,
        name: 'Connor Eaton',
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.EMAIL_API_KEY}`,
      },
    });
    console.log("Email Sent");
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 

