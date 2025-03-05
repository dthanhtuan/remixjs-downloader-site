import type {MetaFunction, ActionFunction} from "@remix-run/node";
import {downloadContent} from "~/utils/download";
import {Form, json, useActionData} from "@remix-run/react";
import {useState} from "react";

export const meta: MetaFunction = () => {
    return [
        {title: "YouTube Downloader"},
        {name: "description", content: "Download videos from YouTube"},
    ];
};

export let action: ActionFunction = async ({request}) => {
    let formData = await request.formData();
    let url = formData.get('url');
    let downloadLink = await downloadContent(url);
    return json({downloadLink});
};

type ActionData = {
    downloadLink: string;
};

export default function YouTube() {
    const actionData = useActionData<ActionData>();
    const [url, setUrl] = useState('');
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6 text-center">YouTube Downloader</h1>
            <Form method="post" className="mb-6">
                <input
                    type="text"
                    name="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube URL here"
                    className="border p-3 w-full mb-4 rounded"
                />
                <button type="submit" className="bg-blue-500 text-white p-3 w-full rounded hover:bg-blue-600">
                    Download
                </button>
            </Form>
            {actionData && (
                <div className="mt-6 text-center">
                    <a href={actionData.downloadLink} className="text-blue-500 underline">
                        Download your file
                    </a>
                </div>
            )}
        </div>
    );
}
