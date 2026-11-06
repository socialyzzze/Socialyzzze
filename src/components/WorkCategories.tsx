import React from "react";
import GlassFolder, { type ArtRecipe } from "@/components/ui/glass-folder-cards";
import { categories } from "@/data/videos";

// Brand palette (blood red + buttercream), a different seed per folder.
const brandArt: ArtRecipe = {
    style: "marble",
    colors: ["#0E090B", "#3A0A10", "#58111A", "#8E1D2E", "#F4E8D7"],
    scale: 0.7,
    warp: 3,
    angle: -0.5,
    gloss: 0.45,
    veins: 0.5,
};
const SEEDS = [3, 7, 11, 19, 23, 31];

const BEAUTY_PREVIEWS = [
    { name: "Glow Editorial", meta: "Reel", art: "verdant" as const },
    { name: "Bridal Lookbook", meta: "Film", art: "dusk" as const },
    { name: "Velvet Lip Campaign", meta: "Reel", art: "ember" as const },
    { name: "Lash & Brow Teaser", meta: "Film", art: "aurora" as const },
];

export function WorkCategories() {
    const go = (slug: string) => {
        window.location.hash = "#work/" + slug;
    };

    return (
        <section
            id="work-categories"
            className="py-20 sm:py-32 px-5 sm:px-6 md:px-16 bg-[#0E090B] border-b border-buttercream/10 text-buttercream"
        >
            <div className="max-w-7xl mx-auto">
                <span className="text-xs uppercase font-mono tracking-[0.3em] text-whispy-light font-bold block mb-2">
                    Selected Work
                </span>
                <h3 className="text-[clamp(1.5rem,6.5vw,2.25rem)] sm:text-4xl font-black font-display uppercase tracking-tight mb-12 sm:mb-16">
                    Pick a world
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14 justify-items-center">
                    {categories.map((c, i) => {
                        const folderFiles =
                            c.videos.length > 0
                                ? c.videos.slice(0, 4).map((v) => ({
                                      name: v.title,
                                      meta: v.orientation === "vertical" ? "Reel" : "Film",
                                      video: v.src,
                                      image: v.poster,
                                  }))
                                : BEAUTY_PREVIEWS;

                        return (
                            <div
                                key={c.slug}
                                onClick={() => go(c.slug)}
                                className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                            >
                                <GlassFolder
                                    label={c.name}
                                    meta={c.videos.length ? `${c.videos.length} videos` : "Coming soon"}
                                    tone="dark"
                                    art={brandArt}
                                    seed={SEEDS[i % SEEDS.length]}
                                    action="none"
                                    width={300}
                                    appear={false}
                                    files={folderFiles}
                                    onOpenChange={(o) => o && go(c.slug)}
                                    onFileSelect={() => go(c.slug)}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

export default WorkCategories;