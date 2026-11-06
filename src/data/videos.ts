export type Orientation = "vertical" | "horizontal";

export interface VideoItem {
    title: string;
    orientation: Orientation;
    /** Direct video file URL (e.g. from Bunny/R2), or a path like /videos/clothing/one.mp4 */
    src?: string;
    /** Or a YouTube video id (the part after v=) */
    youtube?: string;
    /** Optional cover image. Without it, the first frame of the video is used. */
    poster?: string;
}

export interface Category {
    slug: string;
    name: string;
    blurb: string;
    videos: VideoItem[];
}

export const categories: Category[] = [
    {
        slug: "clothing",
        name: "Clothing",
        blurb: "Fashion drops, lookbooks and brand reels.",
        videos: [
            { title: "Our New Factory", orientation: "vertical", src: "/videos/clothing/our-new-factory.mp4" },
            { title: "A Day in Overlays", orientation: "vertical", src: "/videos/clothing/a-day-in-overlays.mp4" },
            { title: "The Emperor Jacket", orientation: "vertical", src: "/videos/clothing/the-emperor-jacket.mp4" },
            { title: "ASMR Overlays", orientation: "vertical", src: "/videos/clothing/asmr-overlays.mp4" },
            { title: "New Jacket Drop", orientation: "vertical", src: "/videos/clothing/new-jacket-collection.mp4" },
            { title: "Hoodies Collection", orientation: "vertical", src: "/videos/clothing/hoodies.mp4" },
            { title: "Layers Vol. 1", orientation: "vertical", src: "/videos/clothing/layers.mp4" },
            { title: "Layers Vol. 2", orientation: "vertical", src: "/videos/clothing/layers-2.mp4" },
            { title: "The Conqueror vs The GOAT", orientation: "vertical", src: "/videos/clothing/the-conqueror-or-the-goat.mp4" },
            { title: "Something Special", orientation: "vertical", src: "/videos/clothing/something-special.mp4" },
            { title: "Yuvraj Campaign", orientation: "vertical", src: "/videos/clothing/yuvraj.mp4" },
        ],
    },
    {
        slug: "luxury",
        name: "Luxury",
        blurb: "High-end brands, told with restraint.",
        videos: [
            { title: "I-W-001 Watch", orientation: "vertical", src: "/videos/luxury/i-w-001.mp4" },
            { title: "I-W-007 Edition", orientation: "vertical", src: "/videos/luxury/i-w-007.mp4" },
            { title: "Luxury Brand Showcase", orientation: "vertical", src: "/videos/luxury/luxury-reel.mp4" },
            { title: "Violet Watch Feature", orientation: "vertical", src: "/videos/luxury/violet-watch.mp4" },
        ],
    },
    {
        slug: "car-detailing",
        name: "Car Detailing",
        blurb: "Paint, polish and process.",
        videos: [
            { title: "Deep Polish & Ceramic", orientation: "vertical", src: "/videos/car-detailing/car-detailing-1.mov" },
            { title: "Exterior Restoration", orientation: "vertical", src: "/videos/car-detailing/car-detailing-2.mov" },
        ],
    },
    {
        slug: "food",
        name: "Food",
        blurb: "Restaurants, cafes and the plate itself.",
        videos: [
            { title: "Artisan Culinary Showcase", orientation: "vertical", src: "/videos/food/food-showcase-1.mov" },
            { title: "Plating Experience", orientation: "vertical", src: "/videos/food/food-showcase-2.mov" },
        ],
    },
    {
        slug: "home-automation",
        name: "Home Automation",
        blurb: "Smart spaces, shown in use.",
        videos: [
            { title: "Smart Ambience & Lighting", orientation: "vertical", src: "/videos/home-automation/home-automation-1.mov" },
            { title: "Living Space Controls", orientation: "vertical", src: "/videos/home-automation/home-automation-2.mov" },
            { title: "Integrated Home Theater", orientation: "vertical", src: "/videos/home-automation/home-automation-3.mov" },
            { title: "Architectural Lighting Scenes", orientation: "vertical", src: "/videos/home-automation/home-automation-4.mov" },
            { title: "Master Suite Automation", orientation: "vertical", src: "/videos/home-automation/home-automation-5.mov" },
            { title: "Seamless Living Experience", orientation: "vertical", src: "/videos/home-automation/home-automation-6.mov" },
        ],
    },
    {
        slug: "beauty",
        name: "Beauty",
        blurb: "Salons, skincare and glow.",
        videos: [
            { title: "Glow & Radiance", orientation: "vertical", src: "/videos/beauty/beauty-1.mp4" },
            { title: "Editorial Film", orientation: "horizontal", src: "/videos/beauty/beauty-2.mp4" },
            { title: "Textures & Closeups I", orientation: "vertical", src: "/videos/beauty/beauty-3-closeups.mp4" },
            { title: "Textures & Closeups II", orientation: "vertical", src: "/videos/beauty/beauty-4-closeups.mp4" },
            { title: "Velvet Skin Routine", orientation: "vertical", src: "/videos/beauty/beauty-5.mp4" },
            { title: "High-Gloss Finish", orientation: "vertical", src: "/videos/beauty/beauty-6.mp4" },
        ],
    },
];

export const findCategory = (slug: string) => categories.find((c) => c.slug === slug);
