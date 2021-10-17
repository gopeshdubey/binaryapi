var dotenv = require("dotenv");
// config() will read your .env file, parse the contents, assign it to process.env.
dotenv.config();

if (dotenv.error) {
  // This error should crash whole process
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

module.exports = {
  email_username: process.env.EMAIL_USERNAME,
  email_secret: process.env.EMAIL_PASSWORD,
  email_host: process.env.EMAIL_HOST,
  email_port: process.env.EMAIL_PORT,
  mongodbUri: process.env.MONGO_URI,
  Twilio_SERVICE_ID: process.env.Twilio_SERVICE_ID,
  Twilio_ACCOUNT_SID: process.env.Twilio_ACCOUNT_SID,
  Twilio_AUTH_TOKEN: process.env.Twilio_AUTH_TOKEN,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
};
