require("dotenv").config();
const nodeMailer = require("nodemailer");

const { APP_EMAIL, APP_PASS, MAIL_TO, MAIL_CC, MAIL_BCC} = process.env;
const practiceMode = !APP_EMAIL || !APP_PASS;

async function sendEmail() {
try {
    const transporter = practiceMode
    ? nodeMailer.createTransport({ jsonTransport: true })
    : nodeMailer.createTransport({
        service: "gmail",
        auth: { user: APP_EMAIL, pass: APP_PASS },
      });

  const mailOptions = {
    from: APP_EMAIL || "karachi@unkown.com.pk",
    to: MAIL_TO || "unkhonperson@gmail.com",
    cc: MAIL_CC ,
    bcc: MAIL_BCC,
    subject: "Welcome to our website",
    text: "We are testing our mailer app",
    html: `
       
<!DOCTYPE html>
<html>
<head>
    <title>Education Email</title>
</head>

<body>

    <h1>Importance of Education</h1>

    <p>Dear Students,</p>

    <p>
        Education is one of the most important parts
        of our lives. It helps us gain knowledge,
        develop skills, and build a better future.
    </p>

    <p>
        Education teaches us how to think, solve
        problems, make good decisions, and become
        responsible members of society.
    </p>

    <h3>Why is Education Important?</h3>

    <ul>
        <li>It increases knowledge and understanding.</li>
        <li>It improves communication skills.</li>
        <li>It creates better career opportunities.</li>
        <li>It builds confidence and personality.</li>
        <li>It helps create a better society.</li>
    </ul>

    <h3>Our Message</h3>

    <p>
        Never stop learning. Every new skill and
        every piece of knowledge brings you one
        step closer to success.
    </p>

    <p>
        Remember, education is not just about
        getting good grades; it is about building
        a brighter future.
    </p>

    <p>Best Regards,</p>
    <p><strong>Education Team</strong></p>

</body>
</html>

    `,
  };

  const info = await transporter.sendMail(mailOptions);

  if (practiceMode) {
    console.log("PRACTICE MODE: ", JSON.parse(info.message));
  }else {
    console.log("Email Sent! ", info.messageId);
  }
} catch (error) {
  console.log("Failed: ", error.message)
}
}

sendEmail();