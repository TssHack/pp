const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', async (req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    const userUrl = req.query.url;
    if (!userUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const requestUrl = 'https://api-v1.viddownloader.io/video-downloader/video/parse-pornhub';
    const data = {
        fp: '3dfaee9a481',  // همانطور که در curl موجود است
        fp1: 'VdOJxowukPvdfeoCXR0eQDfhlB6uIvWv0Gd1nW7M4PAqgJrSPGdDORVuWqsc/GyK',  // همانطور که در curl موجود است
        url: userUrl
    };

    try {
        // ارسال درخواست با axios
        const response = await axios.post(requestUrl, data, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://viddownloader.io',
                'Referer': 'https://viddownloader.io/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br'
            },
            timeout: 10000,  // تایم‌اوت 10 ثانیه‌ای برای جلوگیری از درخواست‌های طولانی
        });

        // خروجی مشابه به ساختار قبلی
        const videoData = response.data.data;

        const result = {
            code: 200,
            msg: '',
            data: {
                image: videoData.image,
                title: videoData.title,
                video_quality: videoData.video_quality.map((quality) => ({
                    url: quality.url,
                    video_type: quality.video_type,
                    mime_type: quality.mime_type,
                    type: quality.type,
                })),
                duration: videoData.duration,
            },
        };

        res.json(result);

    } catch (error) {
        console.error('Error:', error.message);

        if (error.response) {
            // خطاهای مربوط به پاسخ سرور (مثلاً 4xx یا 5xx)
            res.status(error.response.status).json({
                error: 'Request failed',
                status: error.response.status,
                details: error.response.data
            });
        } else if (error.request) {
            // خطاهای مربوط به عدم دریافت پاسخ از سرور
            res.status(500).json({ error: 'No response from server', details: error.request });
        } else {
            // خطاهای دیگر (مثلاً مشکلات مربوط به تنظیمات)
            res.status(500).json({ error: 'Unexpected error', details: error.message });
        }
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
