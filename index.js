const express = require('express');
const fetch = require('node-fetch');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const userUrl = req.query.url;
    if (!userUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const requestUrl = 'https://viddownloader.io/video-downloader/video/parse-pornhub';
    const data = { url: userUrl };

    try {
        // ارسال درخواست اول
        const response1 = await fetch(requestUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response1.ok) {
            return res.status(500).json({ error: 'Error occurred while sending the first request.' });
        }

        // انتظار به مدت 5 ثانیه
        await new Promise(resolve => setTimeout(resolve, 5000));

        // ارسال درخواست دوم
        const response2 = await fetch(requestUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response2.ok) {
            return res.status(500).json({ error: 'Error occurred while sending the second request.' });
        }

        const result = await response2.json();
        res.json(result);

    } catch (error) {
        res.status(500).json({ error: 'An unexpected error occurred.', details: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})    
