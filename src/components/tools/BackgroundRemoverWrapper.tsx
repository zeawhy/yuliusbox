"use client";

import dynamic from "next/dynamic";

const BackgroundRemover = dynamic(() => import("./BackgroundRemover"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[400px] flex items-center justify-center bg-zinc-900/30 rounded-[2.5rem] border border-zinc-800">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-zinc-500 font-medium">Initializing AI Engine...</p>
            </div>
        </div>
    )
});

export default function BackgroundRemoverWrapper() {
    return <BackgroundRemover />;
}
