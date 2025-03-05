import {useState} from "react";
import {Link,Form, json, useActionData} from "@remix-run/react";
import type {MetaFunction, ActionFunction} from "@remix-run/node";
import {downloadContent} from "~/utils/download";
import GoogleAds from "~/components/GoogleAds";

export const meta: MetaFunction = () => {
    return [
        {title: "Youtube Downloader"},
        {name: "description", content: "Download videos from Youtube"},
    ];
};

export const action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const url = formData.get('url');
    const downloadLink = await downloadContent(url);
    return json({downloadLink});
};

type ActionData = {
    downloadLink: string;
};

export default function Youtube() {
    const actionData = useActionData<ActionData>();
    const [url, setUrl] = useState('');

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
                <p className="text-gray-600 mt-2">Download Youtube videos from any post.</p>
                <Form method="post" className="mt-6 flex justify-center">
                    <input
                        type="text"
                        name="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter a Youtube Video Link e.g. https://youtube.com/..."
                        className="border border-gray-300 p-3 w-1/2 rounded-md"
                    />
                    <button type="submit" className="bg-blue-600 text-white px-5 py-3 rounded-md ml-3">Download</button>
                </Form>
                {actionData && (
                    <div className="mt-6 text-center">
                        <a href={actionData.downloadLink} className="text-blue-500 underline">
                            Download your file
                        </a>
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
