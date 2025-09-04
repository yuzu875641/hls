const express = require('express');
const fetch = require('node-fetch');

// 提供されたInvidious APIエンドポイントのリスト
const invidiousAPIs = [
    'https://inv-server-w268.vercel.app',
    'https://inv-server-x88u.vercel.app',
    'https://inv-server-odic.vercel.app',
    'https://inv-server-8ode.vercel.app',
    'https://inv-server-sfjw.vercel.app',
    'https://inv-server-u8ps.vercel.app',
    'https://inv-server-qudk.vercel.app',
    'https://inv-server-2j8x.vercel.app',
    'https://inv-server-woad.vercel.app',
    'https://lekker.gay',
    'https://nyc1.iv.ggtyler.dev',
    'https://invidious.nikkosphere.com',
    'https://invidious.rhyshl.live',
    'https://invid-api.poketube.fun',
    'https://inv.tux.pizza',
    'https://pol1.iv.ggtyler.dev',
    'https://yewtu.be',
    'https://youtube.alt.tyil.nl'
];

const app = express();

app.get("/s/:id", async (req, res) => {
    const videoId = req.params.id;
    if (!videoId) {
        return res.status(400).json({ error: "Video ID is required." });
    }

    try {
        let videoInfo = null;
        let foundUrl = null;

        // APIリストをループして、最初に応答があったものを使用
        for (const baseUrl of invidiousAPIs) {
            const apiUrl = `${baseUrl}/api/v1/videos/${videoId}`;
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    videoInfo = await response.json();
                    foundUrl = baseUrl;
                    break; // 成功したのでループを抜ける
                }
            } catch (error) {
                // エラーが発生しても、次のAPIを試す
                console.error(`Failed to fetch from ${baseUrl}:`, error.message);
            }
        }

        if (!videoInfo) {
            return res.status(503).json({ error: "Failed to retrieve video info from all available APIs." });
        }

        // HLS URLの取得
        const hlsUrl = videoInfo.hlsUrl || (videoInfo.liveStreams && videoInfo.liveStreams[0]?.url);
        
        if (!hlsUrl) {
            return res.status(500).json({ error: "No live stream URL available for this video." });
        }

        // 成功したAPIインスタンスのURLもJSONに含めて返します
        res.status(200).json({ 
            hlsUrl: hlsUrl,
            sourceApi: foundUrl 
        });

    } catch (error) {
        console.error("Internal server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Vercelは、エクスポートされた`app`オブジェクトをサーバーレス関数として自動的に使用します。
module.exports = app;
