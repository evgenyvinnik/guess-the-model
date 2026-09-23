# Challenge image bank

136 playable originals across 15 difficult prompts are saved and registered, with at least four different providers for every prompt. Provider totals are ChatGPT 24, FLUX 24, Meta AI 24, Gemini 24, Copilot 15, native Firefly 12, Yandex Alice 6, Qwen 6, and Grok Imagine 1. The full manifest contains 150 images, including fourteen archived baseline outputs. The target is 24 per provider where each service permits it. Only saved files with manifest entries count toward these totals.

The exact submitted prompts live in [challengePrompts.ts](../src/data/challengePrompts.ts). Per-image source URLs, dates, model labels, and download notes live in [generatedImages.ts](../src/data/generatedImages.ts). These are illustrative stress tests, not a measured model ranking.

## Coverage

Numbers are playable saved outputs per provider; a dash means no playable output. Beyond the six columns, Grok Imagine has the bicycle; Yandex Alice has the bicycle, archer, shoelace, candles, ceramic chain, and piano; Qwen has the bicycle, two archer outputs, ceramic chain, candles, and piano.

| Prompt | ChatGPT | Gemini | Firefly | Meta AI | FLUX | Copilot |
| --- | --- | --- | --- | --- | --- | --- |
| elf-archer-low-angle | 2 | 2 | 2 | 2 | 2 | 2 |
| tailor-mirror | 2 | 2 | 1 | 2 | 2 | 1 |
| ceramic-chain | 2 | 2 | 1 | 3 | 2 | 1 |
| apothecary-inventory | 2 | 2 | 2 | 1 | 2 | 1 |
| bicycle-drivetrain | 2 | 1 | — | 2 | 2 | 1 |
| seventeen-candles | 2 | 2 | 1 | 2 | 2 | 1 |
| guitar-f-major | 2 | 2 | 2 | 2 | 2 | 1 |
| kitchen-four-views | 1 | 1 | — | 1 | 1 | 1 |
| key-story-continuity | 1 | 1 | — | 1 | 1 | 1 |
| precise-cafe-menu | 1 | 1 | — | 1 | 1 | 1 |
| maze-valid-route | 2 | 2 | 1 | 2 | 2 | 1 |
| shoelace-bow | 2 | 2 | 2 | 2 | 2 | 1 |
| chess-knight-move | 1 | 2 | — | 1 | 1 | 1 |
| piano-c-major | 1 | 1 | — | 1 | 1 | 1 |
| nested-glass-refraction | 1 | 1 | — | 1 | 1 | — |

Four-image rounds require four distinct providers with the same prompt id and exact submitted text. Single-image rounds use the same bank. Browser-local history balances target-provider frequency across both question formats and favors underexposed providers among the four comparison images. Within each chosen provider, unseen images appear before its older images repeat. All four displayed comparison images count as seen. The fourteen archived fox, robot, and teapot images remain available to historical statistics and are excluded from new rounds. Grok Imagine, Yandex Alice, and Qwen can appear in either format; their smaller banks repeat after their unseen images are exhausted.

## Generation and version records

- **ChatGPT:** built-in image_gen tool, one independent call per prompt; original 1254 × 1254 PNGs. September 12 originals embed gpt-image version 2.0 in Content Credentials. September 19 originals identify ChatGPT / gpt-image without a numbered revision. See the [metadata audit](chatgpt-content-credentials.json); embedded claims were inspected, not cryptographically verified. Do not apply the older version to newer outputs.
- **Gemini:** Nano Banana 2 displayed in the image-generation UI, Flash conversation mode. Full-size original 2048 × 2048 JPEG downloads. The interface did not expose an API model id.
- **Adobe:** native Firefly Image 5 selected, Square 1:1, 1K, no reference image; original 1024 × 1024 PNG downloads. Adobe-hosted partner models are not labeled Firefly.
- **Meta AI:** Instant conversation mode. Originals downloaded through the UI, usually JPEGs with no disclosed backend image-model version. The second maze is a 2400 × 2400 PNG: its displayed generation steps describe constructing the maze with depth-first search and rendering two panels on a canvas. Its provenance explicitly identifies programmatic rendering without attributing it to an image-generation model. Modern Meta AI is distinct from the historical EMU collection.
- **FLUX:** official Black Forest Labs FLUX.2 [klein] demo; the generated output displays [klein] 9B. Original 1024 × 768 JPEGs are kept at the returned aspect ratio. The browser download supplied a .png filename, which was renamed to .jpg to match the actual JPEG bytes without re-encoding. Each canonical prompt was submitted verbatim. The demo automatically rewrites the displayed prompt into editable attributes, including hexadecimal colors and reformulated wording. This product-level preprocessing is disclosed after the answer; it is not a controlled comparison of raw API prompts. No attributes were manually changed.
- **Copilot:** Auto conversation mode, with no numbered image-model version shown. Twelve original 1254 × 1254 PNGs identify Azure OpenAI ImageGen in their embedded Content Credentials. The 1024 × 1024 candle PNG instead identifies Microsoft Copilot without naming a backend. See the [metadata audit](copilot-content-credentials.json); embedded claims were inspected, not cryptographically verified. Copilot automatically offered two candle responses; the first displayed response (A) was saved without voting. Its original “Made with AI” mark remains visible.
- **Grok Imagine:** one September 22 bicycle challenge original, 960 × 960 JPEG, generated in Speed mode and downloaded through the signed-in Chrome UI. Speed is a mode; the interface did not expose the backend image-model version. The output shows only a rear wheel and drivetrain despite the full-bicycle prompt. The older two Grok baseline originals used Quality 2.0 and remain archived.
- **Yandex Alice:** six September 22 challenge originals (bicycle, archer, shoelace, candles, ceramic chain, piano), all 1024 × 1024 JPEGs generated through Alice's Draw picture tool and downloaded through the signed-in Chrome UI. The tool prefixed each otherwise identical English challenge text with “нарисуй” (draw). The interface did not expose a numbered image-model version. The new candle image has fewer than seventeen candles; the piano image crops the requested two-octave keyboard. These original mistakes, and the earlier shoelace's solid red lace, are retained unchanged.
- **Qwen:** six September 22 challenge originals (bicycle, two archer outputs, ceramic chain, candles, and piano), all 2048 × 2048 PNGs generated on the official Qwen Chat site in Create Image mode with Qwen-Image 3.0 explicitly selected and labeled on the output. The exact English challenge prompts were submitted unchanged. Chrome's Download navigation was blocked by the browser, so the full-resolution assets already rendered in the page were saved unchanged. No preview or screenshot was used. The candle output has six yellow candles instead of five and remains unedited in the bank.

Version certainty belongs to each dated image. Unknown revisions remain “Version not disclosed.” Flash, Instant, and Auto are modes, not model versions. Expected versions require dated supporting evidence and must be visibly marked as estimates. Answer reveals, session reviews, and identified-image statistics show model/version/date details; prompts before answering omit attribution.

## Collection notes

The September 19 expansion adds shoelace topology, a chess capture, piano fingering, and refraction to the eleven earlier challenges. Keep first outputs unchanged, including visible mistakes, unexpected aspect ratios, and provider-added marks. No manual prompt-compliance repairs or quality-based rerolls were requested. Meta’s chess assistant reported automatically regenerating its first attempt before delivering the image; that provider-side behavior is recorded in its provenance and shown after the answer.

A further requested batch adds six Copilot outputs and six additional Meta AI samples for the archer, bicycle, tailor, candles, guitar, and maze prompts. All twelve reuse the exact canonical prompts in fresh conversations. Earlier samples remain in the bank; the additional Meta files have a `-02` suffix. Both question formats automatically draw from these additions using the existing unseen-first history. Six prompt groups now have five distinct providers and six saved outputs. The programmatically rendered Meta maze is a product-level result and should not be interpreted as evidence of an image model's maze-drawing accuracy.

On September 22, ChatGPT, FLUX, Meta AI, and Gemini reached 24 saved challenge outputs each. Meta AI supplied an automatically paired ceramic-chain result and a fresh shoelace result, all saved as unedited JPEGs. Native Firefly Image 5 produced additional archer and maze originals after its daily allowance reset; no Adobe-hosted partner model was substituted. The latest FLUX demo outputs show its automatic prompt-attribute rewriting, including for the shoelace prompt. The original submitted prompts are preserved in the manifest. Nine Gemini Nano Banana 2 outputs were downloaded from separate fresh image requests in Flash mode; one completed bicycle generation had a failed download and is excluded.

Seven further Copilot outputs were downloaded from fresh conversations on September 22, covering the archer, kitchen, key story, menu, shoelace, chess, and piano. All seven preserve the exact submitted prompts, UI-download originals, and observed Azure OpenAI ImageGen family in Content Credentials. A nested-glass-refraction request then returned Copilot's monthly image-creation limit instead of an output, so it is excluded; no upgrade was purchased.

The signed-in Adobe session delivered three more native Firefly Image 5 originals for shoelace, apothecary, and guitar before showing zero free daily generations remaining. Each used the exact canonical prompt and a 1024 × 1024 PNG downloaded through Chrome. The exact kitchen prompt also exceeded Firefly's 1,024-character limit; that rejected request has no output and is excluded.

The September 12 Meta apothecary original was recovered on September 19 from its saved source conversation; its original generation date remains September 12. Firefly's exact bicycle prompt is 1,159 characters: the UI rejected it on September 19 with a 1,024-character limit. The earlier Firefly bicycle attempt also has no saved output. FLUX supplies the bicycle's fourth provider. The prompt was not shortened for Firefly.

Grok previously showed upgrade offers in both Quality 2.0 and Speed without generating a challenge image. A new Speed attempt succeeded on September 22 in signed-in Chrome; no subscription was purchased. Its two saved baseline images remain archived. Browser-origin approval for Gemini, Firefly, Meta AI, and Black Forest Labs was granted by the user. Intermittent Chrome timeouts required smaller batches and use of the in-app browser for the public FLUX demo; pending attempts are never counted. A guest-mode Firefly Image 5 ceramic-chain preview remained download-gated by sign-in on September 22 and is also excluded.

The later archer attempt in Grok Imagine displayed an upgrade gate before submission, so it produced no new original. Qwen's earlier shoelace request prompted age confirmation before submission and produced no output. The first Qwen ceramic-chain request returned an internal connection error, and the first piano request hit a high-demand error; successful retries supplied the counted results.

Observed examples preserved in this bank: ChatGPT's initial archer crops a bow tip; Meta's apothecary shows five stones instead of four; Gemini's chess output contains four boards instead of two; FLUX's kitchen repeats similar viewpoints and its story has eight panels instead of ten. These examples describe individual outputs, not provider-wide performance.

## Exact prompts and inspection guides

### Archer at full draw

Prompt id: `elf-archer-low-angle`. Focus: Foreshortening, anatomy, and hand-object contact.

Create a square cinematic fantasy photograph of an adult elven archer in a dense forest, at full draw and aiming down toward the camera from a mossy rise. The camera is close to the ground at a sharp low angle, looking up almost directly along the arrow. Its metal tip is large in the foreground; one continuous shaft recedes toward her face. Her left hand grips one recurve bow; her right hand draws its string to her jaw. The arrow is nocked against the taut string and rests beside the bow grip. Show the complete bow, both hands, and her focused face, with strong but coherent foreshortening. Dappled sunlight, mist, weathered leather, realistic skin and wood. Anatomically convincing fingers and mechanically consistent bow, string, and arrow. No text, logos, or watermarks.

Inspect:

- Sharp low viewpoint with the arrow aimed toward the camera
- One continuous arrow, one complete bow, and one connected bowstring
- Plausible grip, drawing hand, and arrow-to-string contact
- Coherent foreshortening, fingers, and limb anatomy

### Tailor and mirror

Prompt id: `tailor-mirror`. Focus: Reflection geometry and matching hand actions.

Create a square editorial photograph inside an elegant, slightly worn tailoring studio. An adult tailor wearing a burgundy jacket stands before one tall, flat mirror, adjusting her own left lapel with her left hand while her right hand positions a silver pin. Photograph her from behind and to one side, showing her shoulder and hands directly and her face and chest in the mirror. A narrow table beneath the mirror holds one open pair of brass scissors, one blue pincushion, and one spool of ivory thread; include their corresponding reflections wherever the mirror view permits. Warm window light enters from the left. The reflection must depict exactly the same pose, jacket details, pin, objects, and illumination from the reflected viewpoint. Realistic fingers, fabric, and glass. No decorative duplicate mirrors, text, logos, or watermarks.

Inspect:

- Matching lapel adjustment and pin placement in the reflection
- The same jacket, person, and objects from a reflected viewpoint
- Physically consistent occlusion and mirrored lighting
- Plausible hands and pin contact

### Three interlocking links

Prompt id: `ceramic-chain`. Focus: Topology, continuity, and occlusion.

Create a square fine-art product photograph of a handcrafted chain made from exactly three large, closed ceramic oval links on a charcoal stone pedestal. The left link is glazed deep red, the middle link cobalt blue, and the right link warm ivory. The red link passes through the blue link, and the blue link passes through the ivory link; the red and ivory links are not directly linked. Arrange the chain loosely, with the links resting at different believable angles, so their front and rear arcs and interlocking crossings can be followed. Each link is one continuous solid loop with a clearly open center. Soft raking light reveals glaze imperfections and contact shadows. Quiet sculptor studio background. No text, logos, watermarks, fused junctions, or cut ends.

Inspect:

- Exactly three continuous closed loops with open centers
- Red links to blue; blue links to ivory; red does not link directly to ivory
- Consistent front/back ordering at every crossing
- No fused junctions, disappearing segments, or broken rings

### Apothecary inventory

Prompt id: `apothecary-inventory`. Focus: Exact counts, spatial binding, text, and transparent objects.

Create a square, meticulously composed photograph of an old coastal apothecary workbench, viewed from an elevated front angle. Six identical clear glass jars stand in exactly two rows of three. Raise the back row on a low wooden riser so every jar, its contents, and its front label are visible. The back row, from left to right, is labeled "SALT", "TEA", and "CLOVES"; the front row is labeled "PEARLS", "SHELLS", and "STONES". Fill the back jars with white salt, green tea leaves, and brown cloves respectively. Inside the front jars place exactly three white pearls, two small spiral seashells, and four smooth black pebbles respectively, separated enough to count. A cream card in front reads "TIDE & THYME" on one line. Weathered oak, soft daylight, crisp exact lettering, realistic glass and refraction. No other jars, text, logos, or watermarks.

Inspect:

- Exactly six jars in two rows with all labels visible
- Correct labels, contents, and left-to-right row assignments
- Exactly three pearls, two shells, and four stones
- Exact TIDE & THYME lettering and plausible glass/refraction

### Bicycle drivetrain in profile

Prompt id: `bicycle-drivetrain`. Focus: Mechanical connectivity, concentric gears, and repeated fine structures.

Create a square, high-resolution studio product photograph of one complete, mechanically functional touring bicycle against a seamless pure white background, with only a soft contact shadow beneath its tires. Show the bicycle in a strict right-side, drivetrain-side profile, facing right. The camera is perpendicular to the frame at axle height, with both wheels fully visible and circular, and the whole bicycle comfortably inside the frame. Show exactly two front chainrings of different sizes and a rear cassette with ten concentric toothed sprockets of graduated sizes, with realistic overlap. One intact chain forms a continuous mechanically plausible loop over one front chainring, one rear sprocket, and through the two jockey wheels of the rear derailleur. Show two crank arms pointing in opposite directions, each with one correctly attached pedal. Fine metal spokes connect each wheel hub to its rim; the frame, fork, axles, saddle, handlebars, brake cables, and drivetrain connect as on a real working bicycle. Crisp teeth, links, spokes, and metal detail. No rider, extra wheels, floating parts, exploded view, cutaway, text, logos, or watermarks.

Inspect:

- Strict drivetrain-side profile on white, with two complete circular wheels
- Two front chainrings and ten concentric rear sprockets with plausible teeth and overlap
- One connected chain correctly routed through both derailleur jockey wheels
- Opposed crank arms, attached pedals, and coherent frame, hub, spoke, and fork connections

### Seventeen birthday candles

Prompt id: `seventeen-candles`. Focus: Exact counting and attribute binding.

Create a square, photorealistic overhead photograph of a round ivory birthday cake on a dark walnut table. The cake has exactly seventeen separate, upright, lit birthday candles arranged in three straight parallel rows: the top row has six blue candles, the middle row has five yellow candles, and the bottom row has six red candles. Each candle has one visible wick and one flame. Leave enough space between all candles to count each candle and follow its full length to the icing without overlap. The whole cake is visible with a comfortable margin. There are no other candles, candle-shaped decorations, numbers, writing, people, logos, or watermarks. Soft studio lighting, realistic wax, icing texture, and small warm pools of candlelight.

Inspect:

- Exactly seventeen candles and seventeen flames
- Six blue candles above five yellow candles above six red candles
- Each wick, flame, and candle belongs to one continuous visible object
- Overhead view with no obscured or extra candles

### The F-major barre chord

Prompt id: `guitar-f-major`. Focus: Precise finger placement and instrument geometry.

Create a square, photorealistic instructional close-up of an adult right-handed guitarist playing an F-major barre chord on a normal six-string acoustic guitar in standard tuning. Show the left fretting hand and the complete nut and first four frets at a clear oblique angle from in front of the fretboard. The index finger bars all six strings at fret one; the middle fingertip presses only the G string at fret two; the ring fingertip presses only the A string at fret three; the little fingertip presses only the D string at fret three. The thumb supports the back of the neck. Show exactly six parallel strings, continuous metal frets, anatomically plausible joints, and unambiguous finger-to-string contact immediately behind each required fret. Natural window light and realistic wood, skin, and metal. No chord diagram, labels, text, logos, extra fingers, or watermarks.

Inspect:

- Index finger bars all six strings at the first fret
- Middle on G2, ring on A3, and little finger on D3
- Six continuous strings and distinct, correctly ordered frets
- Plausible finger joints, contact, and thumb position

### One kitchen, four viewpoints

Prompt id: `kitchen-four-views`. Focus: Consistent geometry across camera positions.

Create one square architectural photography contact sheet containing exactly four equal panels in a two-by-two grid with thin white gutters. Every panel depicts the same small rectangular kitchen at the same moment, from a different corner at eye height with a moderate wide-angle lens. Fix the room layout: the north wall has a centered window above a sink and navy base cupboards; the east wall has a tall cream refrigerator beside the northeast corner; the south wall has one oak door beside the southeast corner; the west wall has an open oak shelf with exactly three green mugs. One small rectangular oak table stands in the center, its long axis north-south, with a red kettle on its north end and one yellow chair at its south end. Top-left camera: southwest corner looking northeast. Top-right camera: southeast corner looking northwest. Bottom-left camera: northeast corner looking southwest. Bottom-right camera: northwest corner looking southeast. Preserve the exact room, furniture, object positions, colors, and sunlight from the north window in all four panels; show only surfaces visible from each camera. No floor plan, captions, letters, people, logos, or watermarks.

Inspect:

- Four different corner viewpoints of one unchanged rectangular room
- Sink/window north, refrigerator northeast, door southeast, shelf west
- Table, kettle, chair, and mugs keep their positions across views
- Consistent occlusion, perspective, and north-window lighting

### Ten moments, one key

Prompt id: `key-story-continuity`. Focus: Character identity, object ownership, and state continuity.

Create one square, finely inked and softly colored narrative illustration containing exactly ten equal panels in two rows of five, read left to right across the top row then the bottom row. Tell these ten consecutive moments without words. The same adult woman, with short curly black hair, round glasses, a mustard coat with three black buttons, and a small teal shoulder bag, appears throughout in the same stone hallway beside the same red door and narrow console table. Panel 1: she notices one brass key on the table; the door is closed. Panel 2: she reaches for the key with her right hand. Panel 3: her right hand lifts the key; the table is now empty. Panel 4: she carries the key toward the closed door. Panel 5: she inserts it into the door lock with her right hand. Panel 6: she turns the key while the door stays closed. Panel 7: she pushes the door ajar, with the key still in the lock. Panel 8: she removes the key into her right hand, with the door remaining ajar. Panel 9: she puts the key into her teal bag, with the door still ajar. Panel 10: she walks through the open doorway, both hands empty and the bag still on her shoulder. Maintain one woman, one key, one bag, the same clothing and hallway geometry, and the specified object state in every panel. No duplicated key, speech balloons, captions, numbers, logos, or watermarks.

Inspect:

- Exactly ten panels in the requested reading order
- Stable face, hair, glasses, coat buttons, and bag
- One key progresses from table to hand to lock to hand to bag
- Door stays closed through panel six and open afterward

### A precisely typeset menu

Prompt id: `precise-cafe-menu`. Focus: Dense exact text, prices, alignment, and hierarchy.

Create a square, straight-on photograph of one beautifully typeset cream cafe menu, lying perfectly flat and filling most of the image against a dark green tabletop. Render the menu text exactly as follows, without adding any other words. Center the heading "NORTH PIER CAFE" and the subtitle "SATURDAY MENU". Below, use two equal columns separated by a fine vertical rule. The left column heading is "BREAKFAST" and has these six rows with names left-aligned and prices right-aligned: "Lemon ricotta pancakes" with "$12.50"; "Spinach & feta omelette" with "$11.75"; "Smoked salmon toast" with "$14.00"; "Mushroom breakfast roll" with "$9.25"; "Pear & ginger porridge" with "$8.50"; "Sourdough, butter & jam" with "$6.00". The right column heading is "DRINKS" and has these six rows: "Double espresso" with "$3.25"; "Flat white" with "$4.50"; "Oat milk cappuccino" with "$4.75"; "Jasmine green tea" with "$3.50"; "Blood orange juice" with "$5.25"; "Sparkling water" with "$2.75". Center the footer "Please order at the counter." and below it "All prices include tax." Use elegant dark-green serif typography, readable small text, generous line spacing, and perfectly aligned price columns. No food, utensils, hands, logos, watermarks, or text outside the menu.

Inspect:

- Exact heading, subtitle, two section headings, and footer
- All twelve item names and their correct prices
- Two aligned columns with one vertical rule and no missing or extra rows
- Readable small lettering, punctuation, decimals, and ampersands

### A maze that actually works

Prompt id: `maze-valid-route`. Focus: Topology, exact duplication, and a rule-obeying route.

Create one square, crisp overhead photograph of a white puzzle sheet with two equal maze panels side by side. Each panel contains the exact same square maze on an eight-by-eight cell grid, with thin black orthogonal walls, one entrance centered on the left edge of the upper-left cell, and one exit centered on the right edge of the lower-right cell. Design a connected maze with exactly one solution between entrance and exit, several dead ends, and no isolated cells. The left maze is unsolved and has no colored marks. The right maze must duplicate every wall and opening of the left maze exactly and add one continuous red solution line from entrance to exit. The line runs through corridor centers, turns only at right angles, never crosses or touches a wall, never leaves the maze except through its two openings, and has no branches or gaps. Leave a clean white gutter between the panels. No labels, letters, numbers, decorative artwork, logos, or watermarks.

Inspect:

- Two identical eight-by-eight mazes, including every wall and opening
- One connected maze with a unique entrance-to-exit solution
- Red route appears only on the right and reaches the correct exit
- Continuous unbranched route through corridors without crossing walls

### One shoelace, one bow

Prompt id: `shoelace-bow`. Focus: Continuous strands, knot topology, and over-under crossings.

Create a square, photorealistic macro product photograph of one worn brown leather shoe on a pale gray tabletop, viewed from directly above. The shoe has exactly six pairs of brass eyelets and one continuous ivory shoelace threaded through all twelve eyelets in a conventional crisscross pattern. At the top, the same lace is tied into one ordinary, physically valid shoelace bow with exactly two loops and two free ends. Both free ends have visible metal aglets. The bow is loose enough that its central knot and the alternating over-and-under crossings can be followed, but is still tied and holds the shoe closed. Show the entire shoe, all eyelets, the knot, both loops, and both ends. The lace has a narrow red stripe running continuously along its length, including through the loops. Soft directional studio light, crisp woven fibers and scuffed leather. No hands, second shoe, spare lace, labels, text, logos, or watermarks.

Inspect:

- Six eyelet pairs with one continuous crisscrossed lace
- One physically tied bow with two loops and two aglet-tipped ends
- Coherent crossings and no fused or disappearing lace
- Continuous narrow red stripe along the same lace

### One legal knight move

Prompt id: `chess-knight-move`. Focus: Exact board coordinates and state changes.

Create a square, photorealistic overhead photograph containing two separate wooden chessboards side by side on a neutral studio surface. Each board has exactly eight by eight alternating ivory and walnut squares, with a dark a1 square at bottom left and a light h1 square at bottom right. Clearly print small file letters a through h below each board from left to right, and rank numbers 1 through 8 along its left edge from bottom to top. Use ordinary recognizable black and white chess pieces. On the left board place exactly these five pieces: white king on g1, white knight on e4, white pawn on c3, black king on g8, and black pawn on f6. On the right board show the position after the white knight captures the black pawn on f6: the knight is now on f6, e4 is empty, the captured pawn is absent, and all three other pieces remain on the same squares. There are no other pieces on either board or on the table. Both complete boards are parallel to the image edges, viewed directly from above at the same scale. Subtle shadows, fine wood grain, crisp legible coordinates. No arrows, captions, logos, or watermarks.

Inspect:

- Both boards have 8×8 squares with correct coordinates and corner colors
- Left board contains exactly the five specified pieces at their coordinates
- Right knight moves e4 to f6 and black pawn disappears
- Other three pieces stay fixed and no spare pieces appear

### Five fingers on five keys

Prompt id: `piano-c-major`. Focus: Hand articulation and precise musical key geometry.

Create a square, photorealistic overhead instructional photograph of an adult pianist performing a right-hand five-note C-major scale on an acoustic piano. Show one right hand, its wrist, and exactly two full octaves of the keyboard from C through B twice, with fourteen white keys and ten black keys in the correct repeating groups of two and three. The thumb rests on the first C white key at the left, the index finger on the adjacent D, the middle finger on E, the ring finger on F, and the little finger on G. Every fingertip contacts the middle of its assigned white key with natural curved fingers; the five fingertips occupy five adjacent keys without overlapping or touching a black key. The forearm approaches from the bottom edge and the fingers point toward the top of the image. Realistic skin creases, nails, polished black lacquer, and warm afternoon light. Keep all fourteen white keys and both ends of the keyboard segment visible. No left hand, extra fingers, labels, music notation, letters, logos, or watermarks.

Inspect:

- Fourteen white keys and ten black keys in two complete octave patterns
- Right thumb through little finger contacts C D E F G in order
- Five plausible digits touching five separate adjacent white keys
- Wrist and forearm connect naturally from the bottom

### A spoon through water and glass

Prompt id: `nested-glass-refraction`. Focus: Refraction, transparency, and continuous object geometry.

Create a square, photorealistic physics demonstration photograph on a matte cream tabletop. One clear cylindrical drinking glass is exactly half full of water. One straight stainless-steel teaspoon leans diagonally inside the glass, with its bowl submerged, its handle crossing the water surface, and its upper end protruding above the rim. Photograph at table height from slightly above the water line so both the underwater and above-water portions are visible. The spoon remains physically straight but must appear optically displaced at the water surface and distorted through the curved glass in a believable way. Behind the glass stands a flat card with exactly seven evenly spaced vertical stripes alternating black and white, beginning and ending black; the stripes seen through the glass and water should refract consistently with the same cylindrical glass. Place one small red bead on the tabletop directly in front of the glass, outside it, with a single contact shadow. Preserve one glass, one connected spoon, one bead, one water surface, and realistic reflections without duplicating objects. Soft side lighting, clean restrained scientific photography. No labels, arrows, text, logos, or watermarks.

Inspect:

- One connected straight spoon appears refracted at the water surface
- One half-full cylindrical glass with physically coherent boundaries
- Seven background stripes distorted consistently through glass and water
- One external bead with one contact shadow and no duplicate spoon
