const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// ✅ Configure CORS to handle preflight correctly
app.use(cors({
    origin: '*', // or ['http://localhost:5173'] for stricter control
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

const services = {
    python: 'http://python:5001/run',
    cpp: 'http://cpp:5002/run',
    java: 'http://java:5003/run',
    javascript: 'http://js:5004/run',
    c: 'http://c:5005/run'
};

app.options('/run', cors()); // ✅ Handle preflight OPTIONS request

app.post('/run', async (req, res) => {
    const { language, code } = req.body;
    const url = services[language];
    if (!url) return res.status(400).json({ error: 'Unsupported language' });

    try {
        const response = await axios.post(url, { code });
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => console.log('Router on port 3000'));
