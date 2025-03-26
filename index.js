const express = require('express');
const axios = require('axios');

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
        // ارسال درخواست با axios
        const response = await axios.post(requestUrl, data, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 10000, // تایم‌اوت 10 ثانیه‌ای برای جلوگیری از درخواست‌های طولانی
        });

        // بررسی و پردازش داده‌های دریافتی از سرور
        const videoData = response.data.data;
        const videoInfo = {
            title: videoData.title || 'No title available',
            image: videoData.image || 'No image available',
            video_quality: videoData.video_quality.map(quality => ({
                type: quality.type,
                url: quality.url,
            })),
            duration: videoData.duration || 'No duration available',
        };

        // ارسال پاسخ با فرمت جدید
        res.json({
            success: true,
            data: videoInfo,
        });

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
