import {videoInfoFromYoutube} from "~/utils/download";
import {ActionFunctionArgs, json} from "@remix-run/node";

export async function action({request}: ActionFunctionArgs) {
    if (request.method === 'POST') {
        const formData = await request.formData();
        const url = formData.get('url');

        if (!url) {
            return json({error: 'URL is required'}, {status: 400});
        }
        const videoInfo = await videoInfoFromYoutube(url);
        console.log(videoInfo);
        return json({videoInfo: videoInfo, status: 200});
    }

    return new Response('Method Not Allowed', {status: 405});
}
