import { renderAsync } from '@react-email/render';
import { sendEmail } from './emails/sendEmail';
import getTodoistData from './todoist/getTodoistData';
import dotenv from 'dotenv';
import { IReturnData } from './types/IReturnData';
import EmailTemplate from './emails/EmailTemplate';

dotenv.config();

async function main(){
  const { data, projectsNotInConfig }: IReturnData = await getTodoistData();

  // Get current MDT time
  const now = new Date();
  const hours = now.getHours();

  const to_email = process.env.TO_EMAIL_ADDRESS as string;
  const from_email = process.env.FROM_EMAIL_ADDRESS as string;
  const subject = hours >= 12 ? process.env.SUBJECT_FOR_NIGHTLY_EMAIL as string : process.env.SUBJECT_FOR_MORNING_EMAIL as string;
  const body = await renderAsync(EmailTemplate({data, projectsNotInConfig, isNightly: hours >= 12}));
  
  await sendEmail({
    to: to_email,
    from: from_email,
    subject: subject,
    body: body
  });

}

main();