/** Submit these strings verbatim to every generator; do not repair failed details afterward. */
export const challengePrompts = {
  'elf-archer-low-angle': {
    title: 'Archer at full draw',
    focus: 'Foreshortening, anatomy, and hand-object contact',
    prompt: 'Create a square cinematic fantasy photograph of an adult elven archer in a dense forest, at full draw and aiming down toward the camera from a mossy rise. The camera is close to the ground at a sharp low angle, looking up almost directly along the arrow. Its metal tip is large in the foreground; one continuous shaft recedes toward her face. Her left hand grips one recurve bow; her right hand draws its string to her jaw. The arrow is nocked against the taut string and rests beside the bow grip. Show the complete bow, both hands, and her focused face, with strong but coherent foreshortening. Dappled sunlight, mist, weathered leather, realistic skin and wood. Anatomically convincing fingers and mechanically consistent bow, string, and arrow. No text, logos, or watermarks.',
    checks: [
      'Sharp low viewpoint with the arrow aimed toward the camera',
      'One continuous arrow, one complete bow, and one connected bowstring',
      'Plausible grip, drawing hand, and arrow-to-string contact',
      'Coherent foreshortening, fingers, and limb anatomy',
    ],
  },
  'tailor-mirror': {
    title: 'Tailor and mirror',
    focus: 'Reflection geometry and matching hand actions',
    prompt: 'Create a square editorial photograph inside an elegant, slightly worn tailoring studio. An adult tailor wearing a burgundy jacket stands before one tall, flat mirror, adjusting her own left lapel with her left hand while her right hand positions a silver pin. Photograph her from behind and to one side, showing her shoulder and hands directly and her face and chest in the mirror. A narrow table beneath the mirror holds one open pair of brass scissors, one blue pincushion, and one spool of ivory thread; include their corresponding reflections wherever the mirror view permits. Warm window light enters from the left. The reflection must depict exactly the same pose, jacket details, pin, objects, and illumination from the reflected viewpoint. Realistic fingers, fabric, and glass. No decorative duplicate mirrors, text, logos, or watermarks.',
    checks: [
      'Matching lapel adjustment and pin placement in the reflection',
      'The same jacket, person, and objects from a reflected viewpoint',
      'Physically consistent occlusion and mirrored lighting',
      'Plausible hands and pin contact',
    ],
  },
  'ceramic-chain': {
    title: 'Three interlocking links',
    focus: 'Topology, continuity, and occlusion',
    prompt: 'Create a square fine-art product photograph of a handcrafted chain made from exactly three large, closed ceramic oval links on a charcoal stone pedestal. The left link is glazed deep red, the middle link cobalt blue, and the right link warm ivory. The red link passes through the blue link, and the blue link passes through the ivory link; the red and ivory links are not directly linked. Arrange the chain loosely, with the links resting at different believable angles, so their front and rear arcs and interlocking crossings can be followed. Each link is one continuous solid loop with a clearly open center. Soft raking light reveals glaze imperfections and contact shadows. Quiet sculptor studio background. No text, logos, watermarks, fused junctions, or cut ends.',
    checks: [
      'Exactly three continuous closed loops with open centers',
      'Red links to blue; blue links to ivory; red does not link directly to ivory',
      'Consistent front/back ordering at every crossing',
      'No fused junctions, disappearing segments, or broken rings',
    ],
  },
  'apothecary-inventory': {
    title: 'Apothecary inventory',
    focus: 'Exact counts, spatial binding, text, and transparent objects',
    prompt: 'Create a square, meticulously composed photograph of an old coastal apothecary workbench, viewed from an elevated front angle. Six identical clear glass jars stand in exactly two rows of three. Raise the back row on a low wooden riser so every jar, its contents, and its front label are visible. The back row, from left to right, is labeled "SALT", "TEA", and "CLOVES"; the front row is labeled "PEARLS", "SHELLS", and "STONES". Fill the back jars with white salt, green tea leaves, and brown cloves respectively. Inside the front jars place exactly three white pearls, two small spiral seashells, and four smooth black pebbles respectively, separated enough to count. A cream card in front reads "TIDE & THYME" on one line. Weathered oak, soft daylight, crisp exact lettering, realistic glass and refraction. No other jars, text, logos, or watermarks.',
    checks: [
      'Exactly six jars in two rows with all labels visible',
      'Correct labels, contents, and left-to-right row assignments',
      'Exactly three pearls, two shells, and four stones',
      'Exact TIDE & THYME lettering and plausible glass/refraction',
    ],
  },
  'bicycle-drivetrain': {
    title: 'Bicycle drivetrain in profile',
    focus: 'Mechanical connectivity, concentric gears, and repeated fine structures',
    prompt: 'Create a square, high-resolution studio product photograph of one complete, mechanically functional touring bicycle against a seamless pure white background, with only a soft contact shadow beneath its tires. Show the bicycle in a strict right-side, drivetrain-side profile, facing right. The camera is perpendicular to the frame at axle height, with both wheels fully visible and circular, and the whole bicycle comfortably inside the frame. Show exactly two front chainrings of different sizes and a rear cassette with ten concentric toothed sprockets of graduated sizes, with realistic overlap. One intact chain forms a continuous mechanically plausible loop over one front chainring, one rear sprocket, and through the two jockey wheels of the rear derailleur. Show two crank arms pointing in opposite directions, each with one correctly attached pedal. Fine metal spokes connect each wheel hub to its rim; the frame, fork, axles, saddle, handlebars, brake cables, and drivetrain connect as on a real working bicycle. Crisp teeth, links, spokes, and metal detail. No rider, extra wheels, floating parts, exploded view, cutaway, text, logos, or watermarks.',
    checks: [
      'Strict drivetrain-side profile on white, with two complete circular wheels',
      'Two front chainrings and ten concentric rear sprockets with plausible teeth and overlap',
      'One connected chain correctly routed through both derailleur jockey wheels',
      'Opposed crank arms, attached pedals, and coherent frame, hub, spoke, and fork connections',
    ],
  },
  'seventeen-candles': {
    title: 'Seventeen birthday candles',
    focus: 'Exact counting and attribute binding',
    prompt: 'Create a square, photorealistic overhead photograph of a round ivory birthday cake on a dark walnut table. The cake has exactly seventeen separate, upright, lit birthday candles arranged in three straight parallel rows: the top row has six blue candles, the middle row has five yellow candles, and the bottom row has six red candles. Each candle has one visible wick and one flame. Leave enough space between all candles to count each candle and follow its full length to the icing without overlap. The whole cake is visible with a comfortable margin. There are no other candles, candle-shaped decorations, numbers, writing, people, logos, or watermarks. Soft studio lighting, realistic wax, icing texture, and small warm pools of candlelight.',
    checks: [
      'Exactly seventeen candles and seventeen flames',
      'Six blue candles above five yellow candles above six red candles',
      'Each wick, flame, and candle belongs to one continuous visible object',
      'Overhead view with no obscured or extra candles',
    ],
  },
  'guitar-f-major': {
    title: 'The F-major barre chord',
    focus: 'Precise finger placement and instrument geometry',
    prompt: 'Create a square, photorealistic instructional close-up of an adult right-handed guitarist playing an F-major barre chord on a normal six-string acoustic guitar in standard tuning. Show the left fretting hand and the complete nut and first four frets at a clear oblique angle from in front of the fretboard. The index finger bars all six strings at fret one; the middle fingertip presses only the G string at fret two; the ring fingertip presses only the A string at fret three; the little fingertip presses only the D string at fret three. The thumb supports the back of the neck. Show exactly six parallel strings, continuous metal frets, anatomically plausible joints, and unambiguous finger-to-string contact immediately behind each required fret. Natural window light and realistic wood, skin, and metal. No chord diagram, labels, text, logos, extra fingers, or watermarks.',
    checks: [
      'Index finger bars all six strings at the first fret',
      'Middle on G2, ring on A3, and little finger on D3',
      'Six continuous strings and distinct, correctly ordered frets',
      'Plausible finger joints, contact, and thumb position',
    ],
  },
  'kitchen-four-views': {
    title: 'One kitchen, four viewpoints',
    focus: 'Consistent geometry across camera positions',
    prompt: 'Create one square architectural photography contact sheet containing exactly four equal panels in a two-by-two grid with thin white gutters. Every panel depicts the same small rectangular kitchen at the same moment, from a different corner at eye height with a moderate wide-angle lens. Fix the room layout: the north wall has a centered window above a sink and navy base cupboards; the east wall has a tall cream refrigerator beside the northeast corner; the south wall has one oak door beside the southeast corner; the west wall has an open oak shelf with exactly three green mugs. One small rectangular oak table stands in the center, its long axis north-south, with a red kettle on its north end and one yellow chair at its south end. Top-left camera: southwest corner looking northeast. Top-right camera: southeast corner looking northwest. Bottom-left camera: northeast corner looking southwest. Bottom-right camera: northwest corner looking southeast. Preserve the exact room, furniture, object positions, colors, and sunlight from the north window in all four panels; show only surfaces visible from each camera. No floor plan, captions, letters, people, logos, or watermarks.',
    checks: [
      'Four different corner viewpoints of one unchanged rectangular room',
      'Sink/window north, refrigerator northeast, door southeast, shelf west',
      'Table, kettle, chair, and mugs keep their positions across views',
      'Consistent occlusion, perspective, and north-window lighting',
    ],
  },
  'key-story-continuity': {
    title: 'Ten moments, one key',
    focus: 'Character identity, object ownership, and state continuity',
    prompt: 'Create one square, finely inked and softly colored narrative illustration containing exactly ten equal panels in two rows of five, read left to right across the top row then the bottom row. Tell these ten consecutive moments without words. The same adult woman, with short curly black hair, round glasses, a mustard coat with three black buttons, and a small teal shoulder bag, appears throughout in the same stone hallway beside the same red door and narrow console table. Panel 1: she notices one brass key on the table; the door is closed. Panel 2: she reaches for the key with her right hand. Panel 3: her right hand lifts the key; the table is now empty. Panel 4: she carries the key toward the closed door. Panel 5: she inserts it into the door lock with her right hand. Panel 6: she turns the key while the door stays closed. Panel 7: she pushes the door ajar, with the key still in the lock. Panel 8: she removes the key into her right hand, with the door remaining ajar. Panel 9: she puts the key into her teal bag, with the door still ajar. Panel 10: she walks through the open doorway, both hands empty and the bag still on her shoulder. Maintain one woman, one key, one bag, the same clothing and hallway geometry, and the specified object state in every panel. No duplicated key, speech balloons, captions, numbers, logos, or watermarks.',
    checks: [
      'Exactly ten panels in the requested reading order',
      'Stable face, hair, glasses, coat buttons, and bag',
      'One key progresses from table to hand to lock to hand to bag',
      'Door stays closed through panel six and open afterward',
    ],
  },
  'precise-cafe-menu': {
    title: 'A precisely typeset menu',
    focus: 'Dense exact text, prices, alignment, and hierarchy',
    prompt: 'Create a square, straight-on photograph of one beautifully typeset cream cafe menu, lying perfectly flat and filling most of the image against a dark green tabletop. Render the menu text exactly as follows, without adding any other words. Center the heading "NORTH PIER CAFE" and the subtitle "SATURDAY MENU". Below, use two equal columns separated by a fine vertical rule. The left column heading is "BREAKFAST" and has these six rows with names left-aligned and prices right-aligned: "Lemon ricotta pancakes" with "$12.50"; "Spinach & feta omelette" with "$11.75"; "Smoked salmon toast" with "$14.00"; "Mushroom breakfast roll" with "$9.25"; "Pear & ginger porridge" with "$8.50"; "Sourdough, butter & jam" with "$6.00". The right column heading is "DRINKS" and has these six rows: "Double espresso" with "$3.25"; "Flat white" with "$4.50"; "Oat milk cappuccino" with "$4.75"; "Jasmine green tea" with "$3.50"; "Blood orange juice" with "$5.25"; "Sparkling water" with "$2.75". Center the footer "Please order at the counter." and below it "All prices include tax." Use elegant dark-green serif typography, readable small text, generous line spacing, and perfectly aligned price columns. No food, utensils, hands, logos, watermarks, or text outside the menu.',
    checks: [
      'Exact heading, subtitle, two section headings, and footer',
      'All twelve item names and their correct prices',
      'Two aligned columns with one vertical rule and no missing or extra rows',
      'Readable small lettering, punctuation, decimals, and ampersands',
    ],
  },
  'maze-valid-route': {
    title: 'A maze that actually works',
    focus: 'Topology, exact duplication, and a rule-obeying route',
    prompt: 'Create one square, crisp overhead photograph of a white puzzle sheet with two equal maze panels side by side. Each panel contains the exact same square maze on an eight-by-eight cell grid, with thin black orthogonal walls, one entrance centered on the left edge of the upper-left cell, and one exit centered on the right edge of the lower-right cell. Design a connected maze with exactly one solution between entrance and exit, several dead ends, and no isolated cells. The left maze is unsolved and has no colored marks. The right maze must duplicate every wall and opening of the left maze exactly and add one continuous red solution line from entrance to exit. The line runs through corridor centers, turns only at right angles, never crosses or touches a wall, never leaves the maze except through its two openings, and has no branches or gaps. Leave a clean white gutter between the panels. No labels, letters, numbers, decorative artwork, logos, or watermarks.',
    checks: [
      'Two identical eight-by-eight mazes, including every wall and opening',
      'One connected maze with a unique entrance-to-exit solution',
      'Red route appears only on the right and reaches the correct exit',
      'Continuous unbranched route through corridors without crossing walls',
    ],
  },
  'shoelace-bow': {
    title: 'One shoelace, one bow',
    focus: 'Continuous strands, knot topology, and over-under crossings',
    prompt: 'Create a square, photorealistic macro product photograph of one worn brown leather shoe on a pale gray tabletop, viewed from directly above. The shoe has exactly six pairs of brass eyelets and one continuous ivory shoelace threaded through all twelve eyelets in a conventional crisscross pattern. At the top, the same lace is tied into one ordinary, physically valid shoelace bow with exactly two loops and two free ends. Both free ends have visible metal aglets. The bow is loose enough that its central knot and the alternating over-and-under crossings can be followed, but is still tied and holds the shoe closed. Show the entire shoe, all eyelets, the knot, both loops, and both ends. The lace has a narrow red stripe running continuously along its length, including through the loops. Soft directional studio light, crisp woven fibers and scuffed leather. No hands, second shoe, spare lace, labels, text, logos, or watermarks.',
    checks: [
      'Six eyelet pairs with one continuous crisscrossed lace',
      'One physically tied bow with two loops and two aglet-tipped ends',
      'Coherent crossings and no fused or disappearing lace',
      'Continuous narrow red stripe along the same lace',
    ],
  },
  'chess-knight-move': {
    title: 'One legal knight move',
    focus: 'Exact board coordinates and state changes',
    prompt: 'Create a square, photorealistic overhead photograph containing two separate wooden chessboards side by side on a neutral studio surface. Each board has exactly eight by eight alternating ivory and walnut squares, with a dark a1 square at bottom left and a light h1 square at bottom right. Clearly print small file letters a through h below each board from left to right, and rank numbers 1 through 8 along its left edge from bottom to top. Use ordinary recognizable black and white chess pieces. On the left board place exactly these five pieces: white king on g1, white knight on e4, white pawn on c3, black king on g8, and black pawn on f6. On the right board show the position after the white knight captures the black pawn on f6: the knight is now on f6, e4 is empty, the captured pawn is absent, and all three other pieces remain on the same squares. There are no other pieces on either board or on the table. Both complete boards are parallel to the image edges, viewed directly from above at the same scale. Subtle shadows, fine wood grain, crisp legible coordinates. No arrows, captions, logos, or watermarks.',
    checks: [
      'Both boards have 8×8 squares with correct coordinates and corner colors',
      'Left board contains exactly the five specified pieces at their coordinates',
      'Right knight moves e4 to f6 and black pawn disappears',
      'Other three pieces stay fixed and no spare pieces appear',
    ],
  },
  'piano-c-major': {
    title: 'Five fingers on five keys',
    focus: 'Hand articulation and precise musical key geometry',
    prompt: 'Create a square, photorealistic overhead instructional photograph of an adult pianist performing a right-hand five-note C-major scale on an acoustic piano. Show one right hand, its wrist, and exactly two full octaves of the keyboard from C through B twice, with fourteen white keys and ten black keys in the correct repeating groups of two and three. The thumb rests on the first C white key at the left, the index finger on the adjacent D, the middle finger on E, the ring finger on F, and the little finger on G. Every fingertip contacts the middle of its assigned white key with natural curved fingers; the five fingertips occupy five adjacent keys without overlapping or touching a black key. The forearm approaches from the bottom edge and the fingers point toward the top of the image. Realistic skin creases, nails, polished black lacquer, and warm afternoon light. Keep all fourteen white keys and both ends of the keyboard segment visible. No left hand, extra fingers, labels, music notation, letters, logos, or watermarks.',
    checks: [
      'Fourteen white keys and ten black keys in two complete octave patterns',
      'Right thumb through little finger contacts C D E F G in order',
      'Five plausible digits touching five separate adjacent white keys',
      'Wrist and forearm connect naturally from the bottom',
    ],
  },
  'nested-glass-refraction': {
    title: 'A spoon through water and glass',
    focus: 'Refraction, transparency, and continuous object geometry',
    prompt: 'Create a square, photorealistic physics demonstration photograph on a matte cream tabletop. One clear cylindrical drinking glass is exactly half full of water. One straight stainless-steel teaspoon leans diagonally inside the glass, with its bowl submerged, its handle crossing the water surface, and its upper end protruding above the rim. Photograph at table height from slightly above the water line so both the underwater and above-water portions are visible. The spoon remains physically straight but must appear optically displaced at the water surface and distorted through the curved glass in a believable way. Behind the glass stands a flat card with exactly seven evenly spaced vertical stripes alternating black and white, beginning and ending black; the stripes seen through the glass and water should refract consistently with the same cylindrical glass. Place one small red bead on the tabletop directly in front of the glass, outside it, with a single contact shadow. Preserve one glass, one connected spoon, one bead, one water surface, and realistic reflections without duplicating objects. Soft side lighting, clean restrained scientific photography. No labels, arrows, text, logos, or watermarks.',
    checks: [
      'One connected straight spoon appears refracted at the water surface',
      'One half-full cylindrical glass with physically coherent boundaries',
      'Seven background stripes distorted consistently through glass and water',
      'One external bead with one contact shadow and no duplicate spoon',
    ],
  },
} as const;

export type ChallengePromptId = keyof typeof challengePrompts;
