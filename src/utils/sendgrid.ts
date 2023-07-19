import sgMail from "@sendgrid/mail";
import { emailTemplates } from "~/constants";
import { env } from "~/env.mjs";

sgMail.setApiKey(env.SENDGRID_API_KEY);

interface SendEmailProps {
  to: string;
  subject: string;
  template: keyof typeof emailTemplates;
  dynamics?: {
    [key: string]: string;
  };
}

export const sendEmail = async (data: SendEmailProps) => {
  const msg = {
    to: data.to, // Change to your recipient
    from: "services@reddex.app", // Change to your verified sender
    subject: data.subject,
    templateId: emailTemplates[data.template],
    dynamic_template_data: {
      ...data.dynamics,
    },
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
};
