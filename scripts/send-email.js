#!/usr/bin/env node
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Load config
const configPath = path.join(__dirname, '..', '.email-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Parse command line args
const args = process.argv.slice(2);
const subject = args[0] || 'Clawdbot Update';
const body = args[1] || 'No content provided';
const attachmentPath = args[2] || null;

async function sendEmail() {
  const transporter = nodemailer.createTransport(config.smtp);

  const mailOptions = {
    from: config.from,
    to: config.to,
    subject: subject,
    html: body,
    attachments: []
  };

  if (attachmentPath && fs.existsSync(attachmentPath)) {
    mailOptions.attachments.push({
      filename: path.basename(attachmentPath),
      path: attachmentPath
    });
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Email failed:', error.message);
    return false;
  }
}

sendEmail();
