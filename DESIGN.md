# Noor's little happy place

Goal: a small, gentle romantic browser game that cheers up Noor. She likes matcha and lilies, dislikes ginger. End with the user's verbatim letter. No required accounts inside the game, no purchases, no data collection, no fail state.

Choice: untimed tap-to-collect over a platformer. This works on a phone, with a mouse, and with keyboard buttons, without asking a sad recipient to beat a difficult level. A simple greeting card would be easier but would miss the requested game.

Visual source: generated concept exec-63ced7ac-7309-4599-9c66-e63184be4cd3.png. Warm ivory #fcfaf4, dark sage #354b35, main sage #496343, dusty pink #ca8088. Georgia serif titles and italic secondary text; system sans for tiny utility controls. One 1180px-wide stage with a watercolor garden café background, 28px radius; no overlays tinting the artwork. Three native progress labels, real buttons and live status. Generated transparent 2x2 sprite sheet: matcha / ginger / lilies / envelope. Header lily mark, heart-outline hug, sound toggle. One main action at a time.

States: intro; tap six matcha cups (optional ginger jokes); matcha celebration; pick five lily bunches, each revealing a compliment; bouquet celebration; sealed envelope; full verbatim letter; optional playful Taco Bell voucher; replay. All extra state copy is deliberate workflow copy extending the concept. Mobile stacks and reduces type sizes while preserving generous tap targets. Motion is reduced for prefers-reduced-motion. Sound off by default; optional synthesized chimes after a user gesture.

Risks checked: repeat taps must not double-count; async transitions must not mutate a replay; all collection targets remain reachable without motion or timing; keyboard focus moves after screen transitions; letter must stay readable on narrow screens; offline deliverable must embed all assets, and no external font or CDN may be required. Public exposure is not assumed; Sites begins owner-private and a standalone HTML copy will be supplied for sharing.
