import nodemailer from "nodemailer";
import type { ContactRequest } from "@/types/contact";


const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.SENDER_EMAIL,
    pass: process.env.SENDER_EMAIL_PASSWORD,
  },
});

const emailTemplate = ({
  title,
  children,
}: {
  title: string;
  children: string;
}) => {
  const date = new Date();

  const time = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td>

        <!-- HEADER -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f172a">
          <tr>
            <td style="padding:30px 40px">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle">
                    <img src="cid:logo" width="70" height="70" style="display:block" />
                  </td>
                  <td style="padding-left:20px;vertical-align:middle">
                    <div style="font-family:Cinzel,'Times New Roman',serif;font-size:34px;font-weight:bold;letter-spacing:6px;color:#ffffff;line-height:1">
                      AD . EM
                    </div>
                    <div style="margin-top:8px;font-size:12px;letter-spacing:2px;color:#94a3b8">
                      PORTFOLIO
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- DATE -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:18px 40px;border-bottom:1px solid #e2e8f0;font-size:12px;color:#64748b">
              ${time} WIB
            </td>
          </tr>
        </table>

        <!-- CONTENT -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:40px;font-size:14px;line-height:1.8;color:#334155">
              <h2 style="margin:0 0 20px;font-size:22px;font-weight:600;color:#0f172a">
                ${title}
              </h2>
              ${children}
            </td>
          </tr>
        </table>

        <!-- FOOTER -->
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:25px 40px;background:#f8fafc;font-size:12px;color:#64748b">
              Adem Portfolio<br />
              © ${date.getFullYear()} All rights reserved.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>
`;
};

export async function sendContactEmail(data: ContactRequest) {
  const { name, email, subject, message } = data;

  const logoPath = `${process.cwd()}/public/icon1.png`;
  const formattedMessage = message.replace(/\n/g, "<br/>");

  // EMAIL UNTUK OWNER
  await transporter.sendMail({
    from: `"Adem Portfolio" <${process.env.SENDER_EMAIL}>`,
    to: process.env.OWNER_EMAIL,
    replyTo: email,
    subject: `New Contact Message - ${subject}`,
    html: emailTemplate({
      title: "New Contact Message",
      children: `
        <h2 style="color:#0f172a;margin-top:0">New message received</h2>
        <p>Someone has contacted you through your portfolio website.</p>

        <table width="100%" style="margin-top:25px">
          <tr>
            <td style="padding:8px 0;color:#64748b">Name</td>
            <td style="padding:8px 0;font-weight:bold">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Email</td>
            <td style="padding:8px 0;font-weight:bold">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:#64748b">Subject</td>
            <td style="padding:8px 0;font-weight:bold">${subject}</td>
          </tr>
        </table>

        <p style="margin-top:25px"><strong>Message</strong></p>
        <p>${formattedMessage}</p>
      `,
    }),
    attachments: [
      {
        filename: "icon.png",
        path: logoPath,
        cid: "logo",
      },
    ],
  });

  // AUTO REPLY UNTUK PENGIRIM
  await transporter.sendMail({
    from: `"Adem Portfolio" <${process.env.SENDER_EMAIL}>`,
    to: email,
    subject: "Message Received - Adem Portfolio",
    html: emailTemplate({
      title: "Thank You For Contacting Me",
      children: `
        <h2 style="color:#0f172a">Hello ${name}</h2>
        <p>Thank you for reaching out through my portfolio website.</p>
        <p>I have received your message and will review it shortly.</p>

        <p style="margin-top:25px"><strong>Your Message</strong></p>
        <p>${formattedMessage}</p>

        <p style="margin-top:30px">
          Best regards,<br />
          <strong>Adem</strong>
        </p>
      `,
    }),
    attachments: [
      {
        filename: "icon1.png",
        path: logoPath,
        cid: "logo",
      },
    ],
  });
}