import {Fragment, useState} from "react";
import {Listbox, Transition} from "@headlessui/react";
import type {MetaFunction, ActionFunction} from "@remix-run/node";
import {downloadContent} from "~/utils/download";
import {Form, json, useActionData} from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        {title: "Twitter Downloader"},
        {name: "description", content: "Download videos from Twitter"},
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

export default function Twitter() {
    const actionData = useActionData<ActionData>();
    const [url, setUrl] = useState('');

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Navbar */}
            <nav className="bg-white shadow-sm py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <h1 className="text-2xl font-semibold text-blue-600">Twiter Download</h1>
                    <div className="space-x-6">
                        <a href="#" className="text-gray-600 hover:text-blue-500">Home</a>
                        <a href="#" className="text-gray-600 hover:text-blue-500">How to use</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="text-center py-12">
                <h2 className="text-3xl font-bold">
                    <span className="text-blue-600">Twitter</span> Video Downloader
                </h2>
                <p className="text-gray-600 mt-2">Download Twitter videos and GIFs from any Tweet.</p>
                <Form method="post" className="mt-6 flex justify-center">
                    <input
                        type="text"
                        name="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter a Tweet Link e.g. https://twitter.com/..."
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

            {/* How to Download */}
            <section className="bg-white shadow-md rounded-lg p-6 mx-auto w-4/5 mt-8">
                <h3 className="text-xl font-semibold mb-4">How to Download Twitter Videos</h3>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                    <li><strong>Copy the Tweet Link</strong> - Tap the share icon below the tweet and copy the link.
                    </li>
                    <li><strong>Paste the Tweet Link</strong> - Paste the copied link into the input field above.</li>
                    <li><strong>Download the video</strong> - Choose your resolution and click Download.</li>
                </ul>
            </section>
        </div>
    );
}

// FAQ Component
function FaqItem({question, answer}: {question: string, answer: string}) {
    return (
        <Listbox>
            {({open}) => (
                <div className="border-b py-3">
                    <Listbox.Button className="w-full text-left flex justify-between text-gray-700 font-medium">
                        {question}
                        <span>{open ? "▲" : "▼"}</span>
                    </Listbox.Button>
                    <Transition as={Fragment} show={open}>
                        <Listbox.Options className="mt-2 bg-gray-100 p-3 rounded-md">{answer}</Listbox.Options>
                    </Transition>
                </div>
            )}
        </Listbox>
    );
}
