const express = require("express");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET         ;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI        ;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN        ;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY         ;

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");

async function sendMail(mailOptions) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "nagpuresaurabh1610@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const result = await transport.sendMail(mailOptions);
    console.log("Email sent...", result);
  } catch (error) {
    console.error("Error in sendMail:", error.message);
    console.error("Details:", error);
  }
}

async function getUnreadEmails() {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: 1,  // Only fetch one unread email
    });

    const messages = response.data.messages || [];

    if (messages.length === 0) return [];

    const msg = messages[0];
    const email = await gmail.users.messages.get({
      userId: "me",
      id: msg.id,
    });

    return [
      {
        id: email.data.id,
        snippet: email.data.snippet,
        payload: email.data.payload,
      },
    ];
  } catch (error) {
    console.error("Error fetching emails:", error.message);
    console.error("Details:", error);
    throw error;
  }
}

async function categorizeEmail(emailText) {
  try {
    console.log("EmailText:", emailText);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Classify the email content into one of the following categories: Interested, Not Interested, More information.\n\nEmail: ${emailText}\n\nCategory:`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const category = await response.text();

    console.log("Gemini API Category Response:", category);
    return category.trim();
  } catch (error) {
    console.error("Error categorizing email:", error.message);
    console.error("Details:", error);
    throw error;
  }
}

async function generateResponse(emailText, category) {
  try {
    let prompt;
    console.log("category",category);
    switch (category) {
      case "**Interested**":
        prompt = `The email content is: "${emailText}". Generate a professional response suggesting a demo call with available time slots.`;
        break;
      case "**Not Interested**":
        prompt = `The email content is: "${emailText}". Generate a professional response thanking them for their time and offering future assistance.`;
        break;
      case "Category: **More information**":
        prompt = `The email content is: "${emailText}". Generate a professional response providing additional details about the topic of interest.`;
        break;
      default:
        prompt = `The email content is: "${emailText}". Generate a professional response providing additional details about the topic of interest.`;
        break;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = await response.text();

    console.log("Gemini API Response Text:", responseText);
    return responseText.trim();
  } catch (error) {
    console.error("Error generating response:", error.message);
    console.error("Details:", error);
    throw error;
  }
}


async function sendReply(emailId, responseText, recipient) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'nagpuresaurabh1610@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: 'Saurabh Nagpure <nagpuresaurabh1610@gmail.com>',
      to: recipient,
      subject: 'Re: Your recent email',
      text: responseText,
      html: `<p>${responseText}</p><p>Sincerely,<br>Saurabh Nagpure</p>`,
    };

    const result = await transport.sendMail(mailOptions);
    console.log("Reply sent...", result);
  } catch (error) {
    console.error("Error sending reply:", error.message);
    console.error("Details:", error);
  }
}
function extractEmailAddress(headerValue) {
  const emailMatch = headerValue.match(/<(.+?)>/);
  return emailMatch ? emailMatch[1] : headerValue;
}

app.get("/", async (req, res) => {
  try {
    const emails = await getUnreadEmails();
    console.log("Emails fetched:", emails);
    console.log("Number of emails:", emails.length);

    if (emails.length > 0) {
      const email = emails[0];
      const emailText = email.snippet;
      console.log("Email snippet:", emailText);

      const category = await categorizeEmail(emailText);
      console.log("Email category:", category);

      const responseText = await generateResponse(emailText, category);
      console.log("Generated response:", responseText);

      const recipientHeader = email.payload.headers.find(
        (header) => header.name === "From"
      );
      const recipient = recipientHeader ? extractEmailAddress(recipientHeader.value) : null;

      if (!recipient) {
        console.error("No recipient found in the email headers");
        throw new Error("No recipient defined in email");
      }

      console.log("Recipient ", recipient,"email.id",email.id,responseText);

      await sendReply(email.id, responseText, recipient);
    }

    res.render("index", { emails });
  } catch (error) {
    console.error("Error in route handler:", error.message);
    console.error("Details:", error);
    res.status(500).send("Error fetching or processing emails");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Send the email when the script runs
sendMail().catch(console.error);
