const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

// ✅ Only allow your Shopify store
app.use(cors({
  origin: ['https://aabo.in', 'https://aabo.myshopify.com']
}));

app.post('/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'No messages' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // ✅ Secure
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 300,
        messages: messages
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Asha proxy running');
});