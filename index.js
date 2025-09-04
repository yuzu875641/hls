const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// InvidiousのAPIから動画情報を取得するエンドポイント
// ⚠️ このURLは仮のものです。実際のInvidiousインスタンスのAPIドキュメントを参照してください。
const INVIDIOUS_API_BASE = 'https://inv-server-w268.vercel.app/api/v1';

app.get('/get-hls-url', async (req, res) => {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).send('Video ID is required.');
  }

  try {
    // InvidiousのAPIを呼び出して動画情報を取得
    const response = await axios.get(`${INVIDIOUS_API_BASE}/videos/${videoId}`);
    const videoData = response.data;

    // ライブストリームのHLS URLを見つける
    // Invidious APIのレスポンス形式によって、以下のロジックは変わる可能性があります。
    const hlsUrl = videoData.hlsUrl || null;
    if (hlsUrl) {
      res.json({ hlsUrl: hlsUrl });
    } else {
      res.status(404).send('HLS URL not found for this video.');
    }

  } catch (error) {
    console.error('Error fetching video data from Invidious:', error.message);
    res.status(500).send('Failed to retrieve video information.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
