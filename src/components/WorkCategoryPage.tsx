import React, { useEffect, useState } from "react";
import { ArrowLeft, Play, X } from "lucide-react";
import type { Category, VideoItem } from "@/data/videos";

function Thumb({ v }: { v: VideoItem }) {
    const cls = "h-full w-full object-cover";
    if (v.poster) return <img src={v.poster} alt="" className={cls} loading="lazy" />;
    if (v.youtube)
        return <img src={`https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg`} alt="" className={cls} loading="lazy" />;
    if (v.src) return <video src={v.src + "#t=0.5"} preload="metadata" muted playsInline className={cls} />;
    return null;
}

function Player({ v, onClose }: { v: VideoItem; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    const size =
        v.orientation === "vertical"
            ? "h-[85vh] max-w-[92vw] aspect-[9/16]"
            : "w-[92vw] max-w-[1100px] aspect-video";

    return (
        <div
            data-lenis-prevent
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 p-4"
            onClick={onClose}
        >
            <button
                aria-label="Close video"
                onClick={onClose}
                className="absolute right-5 top-5 rounded-full border border-buttercream/20 p-2 text-buttercream hover:bg-buttercream/10"
            >
                <X size={22} />
            </button>
            <div className={`${size} overflow-hidden rounded-xl bg-black`} onClick={(e) => e.stopPropagation()}>
                {v.youtube ? (
                    <iframe
                        src={`https://www.youtube.com/embed/${v.youtube}?autoplay=1&rel=0`}
                        title={v.title}
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                        className="h-full w-full"
                    />
                ) : (
                    <video src={v.src} controls autoPlay playsInline className="h-full w-full" />
                )}
            </div>
        </div>
    );
}

export function WorkCategoryPage({ category }: { category: Category }) {
    const [active, setActive] = useState<VideoItem | null>(null);

    return (
        <div className="min-h-screen bg-[#0E090B] px-5 pb-24 pt-28 text-buttercream sm:px-6 md:px-16">
            <div className="mx-auto max-w-7xl">
                <a
                    href="#work-categories"
                    className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-whispy-light hover:text-buttercream"
                >
                    <ArrowLeft size={14} /> All work
                </a>

                <h1 className="mt-8 font-display text-4xl font-black uppercase tracking-tight sm:text-6xl">
                    {category.name}
                </h1>
                <p className="mt-3 font-mono text-xs uppercase tracking-wider text-buttercream/60">
                    {category.blurb}
                </p>

                {category.videos.length === 0 ? (
                    <p className="mt-16 font-mono text-sm uppercase tracking-widest text-buttercream/40">
                        Videos coming soon
                    </p>
                ) : (
                    <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
                        {category.videos.map((v, i) => (
                            <div key={v.title + i} className="mb-4 break-inside-avoid">
                                <button
                                    onClick={() => setActive(v)}
                                    className={`group relative block w-full overflow-hidden rounded-xl border border-buttercream/10 bg-[#160E12] ${v.orientation === "vertical" ? "aspect-[9/16]" : "aspect-video"
                                        }`}
                                >
                                    <Thumb v={v} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                    <span className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-blood-accent text-buttercream transition-transform group-hover:scale-110">
                                        <Play size={16} fill="currentColor" />
                                    </span>
                                    <span className="absolute bottom-4 left-4 right-4 text-left font-display text-sm font-bold uppercase tracking-wide">
                                        {v.title}
                                    </span>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {active && <Player v={active} onClose={() => setActive(null)} />}
        </div>
    );
}

export default WorkCategoryPage;