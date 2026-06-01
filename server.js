const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());

// ✅ CORS fix — handle preflight + all origins for Shopify
const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [
      'https://aabo.in',
      'https://aabo.myshopify.com'
    ];
    // Allow requests with no origin (e.g. Postman) or allowed origins
    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
};

// ✅ Handle preflight OPTIONS request explicitly
app.options('/chat', cors(corsOptions));

// ✅ Main chat endpoint
app.post('/chat', cors(corsOptions), async (req, res) => {
  const { messages } = req.body;
  if (!messages) return res.status(400).json({ error: 'No messages' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
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
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Asha proxy running');
});
