import {useState} from "react";
import {Link, Form, useActionData, useNavigation} from "@remix-run/react";
import {json} from '@remix-run/node';
import type {MetaFunction, ActionFunction} from "@remix-run/node";
import GoogleAds from "~/components/GoogleAds";
import {downloadVidFromYoutube} from "~/utils/download";

export const meta: MetaFunction = () => {
    return [
        {title: "Youtube Downloader"},
        {name: "description", content: "Download videos from Youtube"},
    ];
};

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const url = formData.get('url');
    const itag = formData.get('itag');

    if (itag) {
        const videoId = formData.get('videoId');
        const title = formData.get('title');
        const result = await downloadVidFromYoutube(url, itag, videoId, title);
        return json({downloadLink: result.downloadLink, title});
    }
};

type ActionData = {
    downloadLink?: string;
    title?: string;
};

export default function Youtube() {
    const actionData = useActionData<ActionData>();
    const [url, setUrl] = useState('');
    const [itag, setItag] = useState('');
    const [videoInfo, setVideoInfo] = useState<{
        availableFormats: { quality: string; itag: string }[],
        title: string,
        videoId: string
    } | null>(null);
    const navigation = useNavigation();
    const isLoading = navigation.state === "submitting";

    const fetchVideoInfo = async () => {
        console.log("fetchVideoInfo called");
        try {
            const formData = new FormData();
            formData.append('url', url);

            const response = await fetch('/api/video-info', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setVideoInfo(data.videoInfo);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Error fetching video info:", error.message);
            } else {
                console.error("An unknown error occurred while fetching video info");
            }
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <nav className="bg-white shadow-sm py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <h1 className="text-2xl font-semibold text-blue-600">Youtube Download</h1>
                    <div className="space-x-6">
                        <Link to="/" className="text-gray-600 hover:text-blue-500">Home</Link>
                        <Link to="#howtouse" className="text-gray-600 hover:text-blue-500">How to use</Link>
                    </div>
                </div>
            </nav>

            <section className="text-center py-12">
                <h2 className="text-3xl font-bold">
                    <span className="text-blue-600">Youtube</span> Video Downloader
                </h2>
                <Form method="post" className="mt-6 flex justify-center">
                    <input
                        type="text"
                        name="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter a Youtube Video Link e.g. https://youtube.com/..."
                        className="border border-gray-300 p-3 w-1/2 rounded-md"
                    />
                    <button type="button" onClick={fetchVideoInfo}
                            className="bg-blue-600 text-white px-5 py-3 rounded-md ml-3">Get Video
                    </button>

                    <div className="mt-6 text-center">
                        {url && (
                            <iframe
                                title="YouTube video player"
                                width="560"
                                height="315"
                                src={`https://www.youtube.com/embed/${new URL(url).searchParams.get('v')}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        )}
                        {isLoading && <p className="mt-6 text-center text-gray-600">Processing, please wait...</p>}
                    </div>
                    {videoInfo && (
                        <>
                            <input type="hidden" name="videoId" value={videoInfo.videoId}/>
                            <input type="hidden" name="title" value={videoInfo.title}/>
                            <div className="flex justify-center items-center">
                                <select
                                    name="itag"
                                    value={itag}
                                    onChange={(e) => setItag(e.target.value)}
                                    className="border border-gray-300 p-3 w-1/2 rounded-md ml-3"
                                >
                                    <option value="">Select Quality</option>
                                    {videoInfo.availableFormats.map((format, index) => (
                                        <option key={index} value={format.itag}>
                                            {format.quality}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-5 py-3 rounded-md ml-3"
                                >
                                    Get Download Link
                                </button>
                            </div>
                        </>
                    )}
                </Form>
                {actionData && actionData.downloadLink && !isLoading && (
                    <div className="mt-6 text-center">
                        <h3 className="text-xl font-semibold mb-4">{actionData.title}</h3>
                        <Link to={actionData.downloadLink} download={actionData.downloadLink} reloadDocument
                              className="text-blue-500 underline">
                            Download your file
                        </Link>
                    </div>
                )}
            </section>

            <section id="howtouse" className="bg-white shadow-md rounded-lg p-6 mx-auto w-4/5 mt-8">
                <h3 className="text-xl font-semibold mb-4">How to Download Youtube Videos</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Copy the Video Link</strong> - Tap the share icon below the video and copy the link.
                    </li>
                    <li><strong>Paste the Video Link</strong> - Paste the copied link into the input field above.</li>
                    <li><strong>Download the video</strong> - Choose your resolution and click Download.</li>
                </ul>
            </section>
            <GoogleAds/>
        </div>
    );
}
