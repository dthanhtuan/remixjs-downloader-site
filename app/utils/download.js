import ytdl from 'ytdl-core';
import {createWriteStream} from 'fs';
import {join} from 'path';
import {tmpdir} from 'os';

export async function downloadContent(url) {
    if (url.includes('twitter.com')) {
        return await downloadFromTwitter(url);
    } else if (url.includes('facebook.com')) {
        return await downloadFromFacebook(url);
    } else if (url.includes('tiktok.com')) {
        return await downloadFromTikTok(url);
    } else if (url.includes('youtube.com') || url.includes('youtu.be')) {
        return await downloadFromYoutube(url);
    } else {
        throw new Error('Unsupported URL');
    }
}

async function downloadFromTwitter(url) {
    return 'https://example.com/twitter-video.mp4';
}

async function downloadFromFacebook(url) {
    return 'https://example.com/facebook-video.mp4';
}

async function downloadFromTikTok(url) {
    return 'https://example.com/tiktok-video.mp4';
}

// FIXME: the download output path is not working, File wasn't available on site error
async function downloadFromYoutube(url) {
    const videoId = ytdl.getURLVideoID(url);
    const outputPath = join(tmpdir(), `${videoId}.mp4`);
    const videoStream = ytdl(url, {quality: 'highest'});

    return new Promise((resolve, reject) => {
        const fileStream = createWriteStream(outputPath);
        videoStream.pipe(fileStream);

        fileStream.on('finish', () => {
            resolve(outputPath);
        });

        fileStream.on('error', (error) => {
            reject(error);
        });
    });
}
