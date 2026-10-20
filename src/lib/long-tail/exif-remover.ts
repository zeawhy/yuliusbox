import type { LongTailContent } from "../long-tail-content";

/**
 * exif-remover long-tail pages.
 * Shared component: ExifRemoverTool (no preset — full interactive cleaner).
 *
 * Angle vs the /tools/exif-remover hub: the hub is the EXIF explainer with
 * AI-marker detection; these pages target the *publishing* intent — stripping
 * metadata before a photo goes public (marketplaces, forums, social).
 */
export const removeImageMetadata: LongTailContent = {
    id: "remove-image-metadata",
    slug: "remove-image-metadata",
    hubId: "exif-remover",
    href: "/tools/exif-remover/remove-image-metadata",
    crumb: "Remove Image Metadata",
    h1: "Remove Image Metadata Before You Post — Free",
    subtitle:
        "Every photo carries hidden data: camera, timestamps, sometimes your GPS location. Strip it all before the image goes public — free, in your browser.",
    metaTitle: "Remove Image Metadata Online — Free | YuliusBox",
    metaDescription:
        "Strip hidden EXIF, IPTC, and XMP metadata from photos before posting or selling them online. Free, unlimited, 100% in-browser — nothing is ever uploaded.",
    keywords: [
        "remove image metadata",
        "remove metadata from image",
        "delete photo metadata online",
        "strip metadata from jpg",
    ],
    howTo: [
        "Drop the photos you're about to publish into the cleaner above.",
        "Review what it finds — the tool shows you the hidden data first.",
        "Clean with one click and post the metadata-free copy instead of the original.",
    ],
    sections: [
        {
            heading: "“Metadata” is bigger than EXIF",
            paragraphs: [
                "EXIF is the famous one — camera model, shutter speed, timestamps — but a modern photo carries three more metadata systems most people never hear about: IPTC (captions, keywords, copyright), XMP (editing history, sometimes entire Lightroom adjustment stacks), and embedded thumbnails that can survive even after you crop the visible image.",
                "This page's cleaner wipes all of them, not just EXIF. It re-encodes the image from raw pixel data, which physically cannot carry any metadata format over — the output is built from pixels alone. What's gone is gone, verifiably: run the cleaned file through the viewer again and you'll see zero fields.",
            ],
        },
        {
            heading: "Where leaked metadata actually hurts",
            paragraphs: [
                "The classic disaster is the marketplace listing: you photograph a laptop on your desk, the photo's GPS tags your home address, and the listing is public. Real-estate photos have exposed sellers' addresses the same way; a “for sale” post with location data is an invitation you didn't mean to send.",
                "Then there's the professional leak: a “screenshot” of a document that still carries the author's name in its metadata, a portfolio piece whose XMP reveals the client name you removed from the visible caption, a dating-profile photo timestamped at 3 AM. None of this is visible in the image — all of it is readable by anyone who downloads the file.",
            ],
        },
        {
            heading: "Do social networks strip this anyway?",
            paragraphs: [
                "Mostly, but unreliably. Instagram, Facebook, and X strip metadata from displayed images — but the original you uploaded sat on their servers first, and messaging apps, email, forums, marketplaces, and dating apps are inconsistent: some strip, some preserve, some strip only the preview. Depending on the platform is depending on a policy you can't see and that can change.",
                "The safe habit is boring: clean the file yourself before it leaves your device. Then it doesn't matter what any platform does with it — there's nothing to leak.",
            ],
        },
        {
            heading: "The 30-second pre-post routine",
            paragraphs: [
                "Make it a habit, not a project: export or download the final image, drop it in the cleaner, glance at the summary (GPS present? that's the red flag), download the clean copy, post that one. Archive the original separately — you may want the timestamps for your own records later.",
                "One exception: photographers who sell or license work should keep metadata in the delivered file — IPTC copyright and contact fields are how your work stays attributed. Strip for casual posting; preserve for professional delivery.",
            ],
        },
    ],
    faqs: [
        {
            question: "Is EXIF the same thing as image metadata?",
            answer: "EXIF is one kind of image metadata — the camera-generated kind. Photos can also carry IPTC (captions, copyright), XMP (editing history), and embedded thumbnails. This cleaner removes all of them by re-encoding from raw pixels.",
        },
        {
            question: "Will removing metadata change how my photo looks?",
            answer: "No. The cleaned copy is re-encoded from the exact pixel data — visually identical. Only the invisible data (camera info, GPS, timestamps, editing history) is discarded.",
        },
        {
            question: "Can cleaning be undone if I change my mind?",
            answer: "No — removal is permanent for that file, which is the point. Always keep your original archived separately and post only the cleaned copy.",
        },
        {
            question: "Does this work for screenshots too?",
            answer: "Yes. Screenshots can carry software names, device info, and timestamps in their metadata. Drop them in like any other image — the cleaner treats every file the same.",
        },
    ],
    related: [
        {
            href: "/tools/exif-remover",
            label: "EXIF Remover — the full tool",
        },
        {
            href: "/tools/image-compressor",
            label: "Compress images for faster uploads",
        },
    ],
};

export const exifRemoverPages: LongTailContent[] = [removeImageMetadata];
