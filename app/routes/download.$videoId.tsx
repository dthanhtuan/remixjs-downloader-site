import { createReadStream } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = async ({ params }) => {
    const { videoId } = params;
    const filePath = join(tmpdir(), `${videoId}.mp4`);
    const fileStream = createReadStream(filePath);
    console.log("filePath", filePath);

    const readableStream = new ReadableStream({
        start(controller) {
            fileStream.on('data', (chunk) => controller.enqueue(chunk));
            fileStream.on('end', () => controller.close());
            fileStream.on('error', (err) => controller.error(err));
        }
    });

    return new Response(readableStream, {
        headers: {
            'Content-Type': 'video/mp4',
            'Content-Disposition': `attachment; filename="${videoId}.mp4"`,
        },
    });
};
