import {Link} from "@remix-run/react";

export default function Index() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-6 text-center">Download Videos from Your Favorite Sites</h1>
            <p className="text-lg text-center mb-6">Easily download videos from YouTube, Facebook, TikTok, and Twitter.</p>
            <ul className="list-disc list-inside">
                <li><Link to="/youtube" className="text-blue-500 underline">YouTube</Link></li>
                <li><Link to="/facebook" className="text-blue-500 underline">Facebook</Link></li>
                <li><Link to="/tiktok" className="text-blue-500 underline">TikTok</Link></li>
                <li><Link to="/twitter" className="text-blue-500 underline">Twitter</Link></li>
            </ul>
        </div>
    );
}
