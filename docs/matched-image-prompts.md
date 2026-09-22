# Archived matched image prompts

This is the original 2026-09-12 batch of fox, robot, and teapot scenes. New games now use 101 saved originals from the harder [challenge image prompts](challenge-image-prompts.md). The combined saved collection contains 115 images. These fourteen originals remain saved and registered for historical statistics and image references; `activeGeneratedImages` excludes them while completed challenge images exist.

The full [image manifest](../src/data/generatedImages.ts) is the authoritative record of each original file, exact submitted prompt, generator, observed version, source URL or tool, date, and selected output. No pending attempt is represented as a completed image. The three exact baseline prompts are preserved below.

## Archived coverage

| Prompt id | Saved providers | Original count |
| --- | --- | --- |
| `fox-train` | ChatGPT, Gemini, Meta AI, Grok, Copilot, Firefly | 6 |
| `rooftop-robot` | ChatGPT, Gemini, Meta AI, Grok, Copilot | 5 |
| `whale-teapot` | ChatGPT, Gemini, Meta AI | 3 |

ChatGPT used the built-in `image_gen` tool. Its three baseline originals record gpt-image version 2.0 in embedded Content Credentials, inspected September 19; see [the metadata audit](chatgpt-content-credentials.json). Gemini used the observed Nano Banana 2 product label in Flash conversations. Meta AI used Instant conversation mode and retains the distinct Meta AI answer label rather than the historical EMU label. Grok used Imagine with Quality 2.0; Copilot used Auto conversation mode. These product and conversation labels do not establish unreported API model versions.

The Adobe fox was generated with **Firefly Image 5**, selected from the Adobe models group. Its Content Credentials identify Adobe Firefly as the source. Partner models available on the Adobe website are not Firefly outputs. Provider-added marks remain unchanged in all saved originals.

Grok and Copilot teapots, and Firefly robot and teapot images, were not completed and saved for this archived batch. Current collection status and provider availability are documented with the [challenge batch](challenge-image-prompts.md), rather than inferred from these older attempts.

## fox-train

Create a square, photorealistic image of a red fox sitting inside an old-fashioned train carriage at dusk, looking out at a rainy city. Warm brass lamps, dark green velvet seats, realistic fur and raindrops, cinematic natural lighting. No text, logos, or watermarks.

## rooftop-robot

Create a square editorial illustration of a tiny robot tending a rooftop garden above a dense futuristic city at sunrise. Terracotta pots, tomatoes, wildflowers, one yellow watering can, warm light and rich details. Hand-painted gouache style. No text, logos, or watermarks.

## whale-teapot

Create a square product photograph of a translucent blue glass teapot shaped like a whale, with tea inside, on a pale stone table beside one small white cup. Soft studio lighting, subtle caustics and realistic reflections, clean composition. No text, logos, or watermarks.
