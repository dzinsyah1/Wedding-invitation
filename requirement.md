# PRD — Interactive 2D Side-Scrolling Wedding Invitation

## 1. PRODUCT VISION

Build a premium, mobile-first wedding invitation website presented as a beautiful interactive 2D side-scrolling world.

The guest does not primarily navigate through traditional web sections.

Instead, the guest enters a 2D illustrated wedding world, controls a small character, and walks from left to right through different wedding scenes.

Each scene represents a section of the wedding invitation.

When the character reaches an interactive location, object, NPC, sign, or building, an interaction prompt appears.

The guest taps/clicks the interaction button and a beautiful modal opens containing the relevant wedding information.

Core experience:

> **Walk → Discover → Interact → Read → Continue**

The product should feel like:

> A beautiful interactive wedding invitation that happens to be a small 2D game.

It must NOT feel like:

> A normal wedding website with a game layered on top.

---

# 2. CORE CONCEPT

The entire invitation exists inside one continuous horizontal 2D world.

Example:

```text
START
  │
  ▼
🏡 HOME
  │
  ├── Couple
  │
  ▼
🌸 GARDEN
  │
  ├── Our Story
  │
  ▼
🕌 MOSQUE
  │
  ├── Akad
  │
  ▼
🏛️ WEDDING VENUE
  │
  ├── Reception
  │
  ▼
🕰️ CLOCK
  │
  ├── Countdown
  │
  ▼
📸 PHOTO AREA
  │
  ├── Gallery
  │
  ▼
📮 MAILBOX
  │
  ├── RSVP
  │
  ▼
🎁 GIFT
```

The player can move:

* Left
* Right

The world is wider than the viewport.

The camera follows the player horizontally.

---

# 3. PRODUCT PRINCIPLES

## Principle 1 — Wedding First, Game Second

The experience must remain elegant and appropriate for a wedding.

Avoid:

* RPG combat UI
* health bars
* enemies
* fantasy game HUD
* excessive gaming terminology
* childish game effects
* aggressive animations

The game mechanic exists to make the invitation memorable.

---

## Principle 2 — Beautiful World

The environment must feel alive.

Use:

* animated trees
* moving grass
* flowers moving in the wind
* clouds moving slowly
* birds flying occasionally
* butterflies
* floating particles
* subtle sunlight
* character idle animation
* character walking animation
* water movement where applicable
* lantern glow
* subtle building animation
* ambient lighting

The world should never feel like a static image.

---

## Principle 3 — Extremely Simple Controls

The guest should immediately understand the interaction.

Desktop:

```text
←       →
```

Optional:

```text
A       D
```

Mobile:

```text
      ◀       ▶
```

No joystick is necessary for MVP.

Because movement is only horizontal, two large buttons are better and easier to understand.

---

## Principle 4 — Information Must Be Easy to Access

The guest should not be forced to walk through the entire world to find important information.

Provide a Quick Navigation menu.

Example:

```text
🏠 Home
💑 Couple
📖 Story
🕌 Akad
🏛️ Reception
🕰️ Countdown
📸 Gallery
📮 RSVP
🎁 Gift
```

Walking is the primary experience.

Quick Navigation is the accessibility shortcut.

---

# 4. TARGET USERS

## Guest

People receiving the wedding invitation.

Potential users:

* young adults
* friends
* family
* parents
* older guests
* people unfamiliar with games

Therefore the UX must require almost zero learning.

---

# 5. PLATFORM

Primary:

* Mobile browser

Secondary:

* Desktop browser
* Tablet

No native app.

No installation.

No account required for guests.

---

# 6. EXPERIENCE FLOW

## STEP 1 — Invitation Landing

User opens the invitation URL.

Show an elegant animated opening screen.

Example:

```text
              ✦

        The Wedding of

        RIZKY
          &
        AISYAH

       20.09.2026

     Our Little Journey

          [ ENTER ]

              ✦
```

Background should already be animated.

Possible animations:

* floating particles
* moving clouds
* flowers moving
* subtle light rays
* slowly moving leaves
* gentle parallax

---

# 7. OPENING ANIMATION

When page loads:

1. Background fades in.
2. Clouds slowly move.
3. Small particles appear.
4. Couple names animate in.
5. Date fades in.
6. Enter button appears.
7. Optional music button appears.

Do NOT use excessive animations.

Animation style:

* soft
* cinematic
* romantic
* elegant
* smooth

---

# 8. ENTER WORLD

When user clicks:

> ENTER OUR WORLD

Transition:

1. Opening UI fades.
2. Camera moves toward the world.
3. Player character appears.
4. Environment fades in.
5. Background music starts if user has interacted with the page.
6. Movement controls appear.

Optional small instruction:

> Explore our little story →

Display for approximately 2–3 seconds.

Then disappear.

---

# 9. MAIN WORLD

The world should be a continuous horizontal scene.

Recommended initial world width:

Approximately:

`5000–8000px`

This should be adjusted based on actual visual composition.

Do NOT make the world unnecessarily large.

The entire journey should take approximately:

**3–7 minutes**

for a guest who explores everything naturally.

---

# 10. WORLD STRUCTURE

Recommended layout:

```text
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│       🌳       🏡          🌸       🕌       🌳              │
│                                                               │
│                    👨‍❤️‍👩                                     │
│                                                               │
│       🧍                                                    │
│                                                               │
│───────────────────────────────────────────────────────────────│
│                                                               │
│              ◀                              ▶                 │
└───────────────────────────────────────────────────────────────┘
```

The actual world should contain multiple visual scenes.

---

# 11. SCENE 01 — HOME / HERO

The first area should contain a beautiful traditional/modern Indonesian house.

Possible visual direction:

* elegant Indonesian house
* warm wooden elements
* garden
* flowers
* hanging lamps
* trees
* small pathway
* wedding decorations

The player starts near the house.

Interactive object:

### WELCOME

When interacted:

Open invitation modal.

Content:

* Bismillah
* wedding invitation message
* couple names
* date

---

# 12. SCENE 02 — COUPLE

After walking right, the player encounters the couple.

Example:

```text
🌳        🌸

       👨 ❤️ 👩

    "Meet The Couple"

───────────────
```

The couple should have subtle idle animation.

Possible animations:

* breathing
* slight body movement
* blinking
* subtle clothing movement
* small floating heart particles
* hair movement

Do not over-animate.

When player enters interaction zone:

```text
💑 Meet The Couple
```

Tap → modal.

---

# 13. COUPLE MODAL

Modal contains:

### Groom

* Photo
* Full name
* Nickname
* Parents

### Bride

* Photo
* Full name
* Nickname
* Parents

Visual:

Elegant card with subtle decorative elements.

Avoid generic Bootstrap-style modal.

---

# 14. SCENE 03 — OUR STORY

Use a large illustrated object:

* book
* photo album
* tree
* bench
* signboard

Example:

```text
             🌳
         📖 OUR STORY

              🧍
```

Interaction:

> READ OUR STORY

Modal contains timeline.

Example:

```text
2019
First Meeting

2021
We Became Closer

2025
The Proposal

2026
Our Wedding
```

Each chapter can contain:

* date
* title
* description
* optional image

---

# 15. STORY ANIMATION

When opening story modal:

Do not simply show the entire text instantly.

Use subtle sequential animation:

1. Chapter title fades in.
2. Date appears.
3. Image fades in.
4. Description appears.

Optional horizontal swipe between chapters.

---

# 16. SCENE 04 — AKAD NIKAH

Environment transitions into a more elegant Islamic setting.

Example:

```text
🌳         🕌         🌳
             ✦

        AKAD NIKAH

             🧍
```

Visual elements:

* mosque
* Islamic architectural details
* garden
* lanterns
* flowers
* subtle sunlight

Avoid excessive religious ornamentation.

---

# 17. AKAD INTERACTION

Interaction label:

> VIEW AKAD DETAILS

Modal:

### Akad Nikah

Date

Time

Venue

Address

Buttons:

* Lihat Lokasi
* Tambahkan ke Kalender

---

# 18. SCENE 05 — RECEPTION

Continue walking.

Environment gradually changes into a wedding reception area.

Possible environment:

* wedding hall
* decorated garden
* gazebo
* stage
* flowers
* hanging lights
* tables
* decorative arches

Example:

```text
      ✦       ✦       ✦

          🏛️
     WEDDING RECEPTION

             🧍

──────────────────────────
```

---

# 19. RECEPTION MODAL

Show:

* event title
* date
* time
* venue
* address
* map button
* calendar button

Optional:

* dress code
* additional notes

---

# 20. SCENE 06 — COUNTDOWN

Use a visually important object.

Recommended:

### Large clock tower

or

### Giant elegant wedding clock

Example:

```text
             🕰️
        THE BIG DAY

            🧍
```

Clock should have subtle animation.

Possible animations:

* moving clock hands
* light glow
* floating particles
* small birds
* subtle bell movement

---

# 21. COUNTDOWN MODAL

Show:

```text
OUR BIG DAY

12
DAYS

08
HOURS

41
MINUTES

22
SECONDS
```

Use realtime countdown.

Timezone must be configurable.

Default:

`Asia/Jakarta`

After wedding date:

> TODAY IS THE DAY ❤️

After the wedding:

> Thank you for celebrating our special day with us.

---

# 22. SCENE 07 — GALLERY

Create a small photo booth / photo wall.

Example:

```text
        📸
     OUR MEMORIES

   ┌───┐ ┌───┐ ┌───┐
   │   │ │   │ │   │
   └───┘ └───┘ └───┘

          🧍
```

When interacted:

Open gallery modal.

Gallery should support:

* grid
* swipe
* lightbox
* captions

Images must lazy load.

---

# 23. GALLERY ANIMATION

When opening:

* images fade/scale in sequentially
* avoid heavy animation
* support swipe on mobile

When closing:

* smooth fade out

---

# 24. SCENE 08 — RSVP

Use a mailbox.

Example:

```text
              💌

          RSVP HERE

             🧍
```

Mailbox may have subtle animation:

* flag moving
* letter particle
* slight bounce

Interaction:

> RSVP NOW

---

# 25. RSVP MODAL

Fields:

### Name

Required.

### Attendance

Options:

* Akan hadir
* Tidak dapat hadir
* Masih belum pasti

### Number of guests

Stepper:

`- 1 +`

### Message

Optional.

Submit button:

> KIRIM RSVP

Success:

> Thank you for confirming your attendance ❤️

---

# 26. SCENE 09 — WEDDING GIFT

Use a decorative gift box.

Example:

```text
          ✨
          🎁
     WEDDING GIFT

           🧍
```

Gift box should have subtle idle animation.

Interaction:

> WEDDING GIFT

Modal:

> Your presence is already a precious gift to us.

Then:

* Bank
* Account number
* Account holder
* E-wallet
* Physical gift address

Copy buttons.

---

# 27. FINAL SCENE

At the end of the journey, create a beautiful final environment.

Possible:

* sunset
* garden
* mountain
* wedding lights
* couple silhouette

Example:

```text
          ☀️

       👨 ❤️ 👩

   Thank You For Being
     Part Of Our Story

            ✦
```

Display:

> Thank you for being part of our special day.

Optional:

> With love,
> Rizky & Aisyah

---

# 28. PLAYER CHARACTER

Player should be visually attractive.

Character style must match the selected world.

MVP:

* one male/female neutral couple-themed character or configurable character
* walking animation
* idle animation

Minimum animation states:

```text
IDLE
WALK_LEFT
WALK_RIGHT
```

Optional:

```text
INTERACT
CELEBRATE
```

---

# 29. CHARACTER ANIMATION

Walking:

* 4–8 frame animation preferred
* smooth loop
* consistent walking speed

Idle:

* subtle breathing
* occasional blink
* slight clothing/hair movement

Interaction:

* character turns toward object
* short reaction animation

Do NOT make character movement exaggerated.

---

# 30. ENVIRONMENT ANIMATION SYSTEM

The environment must feel alive.

Implement multiple animation layers.

## Layer 1 — Background

Slow movement:

* clouds
* mountains
* distant landscape

Very slow parallax.

## Layer 2 — Midground

Movement:

* trees
* buildings
* decorations

Small parallax.

## Layer 3 — Foreground

Movement:

* grass
* flowers
* leaves
* particles

Faster parallax.

---

# 31. PARALLAX SYSTEM

Use at least 3 layers:

```text
BACKGROUND
      ↓
MIDGROUND
      ↓
WORLD
      ↓
FOREGROUND
```

Camera movement should create depth.

Example:

```text
Clouds        move 0.10x
Mountains     move 0.25x
Buildings     move 0.70x
Player        move 1.00x
Foreground    move 1.15x
```

Values are configurable.

---

# 32. AMBIENT ANIMATION

Add subtle random events.

Examples:

### Birds

Occasionally fly across the sky.

### Butterflies

Occasionally move around flowers.

### Leaves

Occasionally fall.

### Fireflies

Appear in evening scenes.

### Clouds

Slowly move.

### Grass

Slight wind movement.

### Flowers

Slight sway.

These events should be low frequency.

Avoid visual clutter.

---

# 33. TIME / LIGHTING

The world can have subtle lighting transitions.

Recommended:

### Opening

Warm morning.

### Wedding world

Soft daylight.

### Final area

Golden hour / sunset.

The transition should be gradual.

This creates a visual journey without requiring separate pages.

---

# 34. CAMERA SYSTEM

Camera follows player horizontally.

Requirements:

* smooth follow
* no jitter
* world boundaries
* responsive
* mobile optimized

Camera should not always be centered exactly on the player.

Use dead-zone behavior.

This makes movement feel more natural.

---

# 35. MOVEMENT SYSTEM

Movement should have acceleration/deceleration.

Do NOT instantly teleport the character.

Example:

```text
Press right
     ↓
accelerate
     ↓
walking
     ↓
release
     ↓
decelerate
     ↓
idle
```

Movement should feel soft.

---

# 36. INTERACTION ZONES

Every interactive object has a trigger area.

Example:

```text
       🕌
   ┌───────────┐
   │ INTERACT  │
   │   ZONE    │
   └───────────┘
        🧍
```

When player enters:

Display floating prompt.

Example:

> ✦ Lihat Detail Akad

The interaction zone should be generous enough for mobile users.

---

# 37. INTERACTION PROMPT

Prompt should visually match the wedding theme.

Do NOT use generic:

> Press E

Instead:

Desktop:

> **[ E ] Lihat Detail**

Mobile:

> **Lihat Detail**

The prompt can gently float.

Animation:

```text
fade in
↓
slight upward movement
↓
idle
```

---

# 38. MODAL DESIGN

Modal must feel like part of the world.

Use:

* rounded corners
* subtle shadow
* decorative frame
* elegant typography
* soft backdrop blur
* slight scale-in animation

Opening:

```text
opacity 0 → 1
scale 0.96 → 1
```

Closing:

```text
opacity 1 → 0
scale 1 → 0.98
```

Duration:

Approximately 200–300ms.

---

# 39. MOBILE UI

Bottom controls:

```text
┌──────────────────────────────────┐
│                                  │
│              GAME                │
│                                  │
│                                  │
│                                  │
│                                  │
│                                  │
│                                  │
│                                  │
│     ◀                         ▶   │
└──────────────────────────────────┘
```

Buttons should be:

* large
* touch friendly
* semi-transparent
* elegant
* not obstructive

Minimum touch target:

~44px.

Recommended:

56–64px.

---

# 40. QUICK NAVIGATION

Floating button:

```text
☰
```

When opened:

```text
┌─────────────────────────┐
│       OUR WEDDING       │
│                         │
│ 🏠 Home                 │
│ 💑 Couple               │
│ 📖 Our Story            │
│ 🕌 Akad                 │
│ 🏛️ Reception            │
│ 🕰️ Countdown            │
│ 📸 Gallery              │
│ 💌 RSVP                 │
│ 🎁 Wedding Gift         │
└─────────────────────────┘
```

Selecting an item smoothly moves the player/camera to the corresponding location.

---

# 41. NAVIGATION TRANSITION

When user selects:

> Akad

Do NOT instantly change page.

Instead:

1. Close menu.
2. Camera/player smoothly moves toward Akad location.
3. Character walks automatically.
4. Camera follows.
5. Stop at interaction zone.
6. Show prompt.

This preserves the illusion of being inside one world.

---

# 42. MUSIC

Background music should be optional.

Do not force autoplay.

Initial UI:

```text
🎵 Music Off
```

After user enables:

```text
🎵 Music On
```

Music should continue while navigating.

When modal opens:

Music can continue at reduced volume.

---

# 43. SOUND EFFECTS

Optional subtle sounds:

* footsteps
* button click
* interaction
* modal open
* mailbox
* gift
* soft ambient wind
* birds

Sound must be subtle.

Avoid arcade sounds.

---

# 44. VISUAL STYLE

Default theme:

## Romantic Indonesian Cozy Illustration

Visual direction:

* 2D illustrated
* warm
* detailed
* charming
* premium
* romantic
* slightly whimsical

Avoid:

* cheap clipart
* generic stock illustration
* childish cartoon
* excessive pixelation
* dark RPG style
* fantasy medieval style

---

# 45. ART DIRECTION

The world should feel like an illustrated wedding storybook.

Recommended visual qualities:

* hand-painted appearance
* clean silhouettes
* rich environmental details
* warm lighting
* layered depth
* subtle texture
* elegant color palette

Suggested palette:

* cream
* sage green
* muted teal
* warm brown
* soft gold
* ivory
* dusty rose

Colors should be configurable by theme.

---

# 46. CHARACTER / COUPLE CUSTOMIZATION

Architecture must support future character customization.

Possible future options:

* male/female
* skin tone
* hairstyle
* clothing
* hijab
* traditional clothing
* modern clothing
* wedding outfit

Do not build full customization UI in MVP.

But asset architecture must allow it later.

---

# 47. MUSLIM INDONESIAN WEDDING SUPPORT

Default content structure should support:

* Bismillah
* Islamic wedding invitation wording
* groom
* bride
* parents
* akad
* reception
* doa
* RSVP
* gallery
* location
* wedding gift

Religious content should be configurable.

Do not hardcode text.

---

# 48. DATA-DRIVEN ARCHITECTURE

Wedding information must not be hardcoded inside game scenes.

Use structured configuration.

Example:

```ts
interface WeddingData {
  couple: CoupleData;
  events: EventData[];
  story: StoryChapter[];
  gallery: GalleryItem[];
  countdown: CountdownData;
  rsvp: RSVPConfig;
  gift: GiftData;
  music: MusicConfig;
  theme: ThemeConfig;
  world: WorldConfig;
}
```

---

# 49. WORLD CONFIGURATION

Example:

```ts
interface WorldLocation {
  id: string;
  x: number;
  width: number;

  interaction: {
    label: string;
    type: InteractionType;
  };

  navigation: {
    icon: string;
    label: string;
  };
}
```

Example:

```ts
{
  id: "akad",
  x: 2450,
  width: 400,

  interaction: {
    label: "Lihat Detail Akad",
    type: "event"
  },

  navigation: {
    icon: "mosque",
    label: "Akad"
  }
}
```

---

# 50. WORLD SECTIONS MUST BE CONFIGURABLE

The engine must not assume that every wedding has exactly the same world.

For example:

Wedding A:

```text
Home
Couple
Story
Akad
Reception
Countdown
Gallery
RSVP
Gift
```

Wedding B:

```text
Home
Couple
Story
Akad
Reception
Gallery
RSVP
```

The world should adapt based on enabled sections.

---

# 51. TECHNOLOGY

Recommended stack:

### Framework

Next.js

### Language

TypeScript

### Game rendering

Phaser 3

### UI

React

### Styling

Tailwind CSS

### State

Zustand or lightweight custom store

### Backend

Supabase

### Deployment

Vercel-compatible deployment

---

# 52. WHY PHASER

Use Phaser because the project needs:

* sprite animation
* camera
* world coordinates
* collision
* parallax
* animation
* particles
* input
* mobile touch
* efficient 2D rendering

React should NOT render the game world.

Phaser owns:

* player
* world
* camera
* movement
* collision
* animation
* interactive zones

React owns:

* opening screen
* modal
* quick navigation
* RSVP form
* gallery
* countdown UI
* gift UI
* general interface

---

# 53. ARCHITECTURE

Recommended:

```text
src/
│
├── app/
│   ├── page.tsx
│   └── wedding/
│       └── page.tsx
│
├── components/
│   ├── opening/
│   ├── modal/
│   ├── navigation/
│   ├── controls/
│   └── wedding/
│
├── game/
│   ├── Game.ts
│   │
│   ├── scenes/
│   │   ├── BootScene.ts
│   │   ├── PreloadScene.ts
│   │   └── WeddingWorldScene.ts
│   │
│   ├── player/
│   │   ├── Player.ts
│   │   └── PlayerAnimation.ts
│   │
│   ├── world/
│   │   ├── WorldBuilder.ts
│   │   ├── WorldLocation.ts
│   │   ├── ParallaxLayer.ts
│   │   └── InteractiveZone.ts
│   │
│   ├── systems/
│   │   ├── MovementSystem.ts
│   │   ├── InteractionSystem.ts
│   │   ├── CameraSystem.ts
│   │   ├── AmbientSystem.ts
│   │   └── AudioSystem.ts
│   │
│   └── events/
│       └── gameEvents.ts
│
├── data/
│   ├── wedding.ts
│   ├── world.ts
│   └── theme.ts
│
├── types/
│   └── wedding.ts
│
└── assets/
    ├── characters/
    ├── environment/
    ├── buildings/
    ├── objects/
    ├── particles/
    ├── ui/
    └── audio/
```

---

# 54. PHASER ↔ REACT COMMUNICATION

Use an event-driven interface.

Example:

```ts
gameEvents.emit("OPEN_MODAL", {
  type: "akad"
});
```

React listens and opens the correct modal.

Reverse direction:

```ts
gameEvents.emit("NAVIGATE_TO", {
  locationId: "akad"
});
```

Phaser receives the event and moves the player/camera.

Do not tightly couple Phaser scenes to React components.

---

# 55. ANIMATION SYSTEM

Build reusable animation utilities.

Required:

### Player

* idle
* walk left
* walk right
* interact

### Environment

* tree sway
* grass sway
* cloud movement
* bird movement
* butterfly movement
* floating particles
* light flicker
* water movement
* flower movement

### UI

* fade
* scale
* slide
* floating prompt
* button hover/tap

---

# 56. PARTICLE SYSTEM

Use particles sparingly.

Possible particle types:

* dust
* petals
* fireflies
* sparkles
* leaves
* soft light

Each scene can enable different particles.

Example:

Garden:

```text
petals + butterflies
```

Mosque:

```text
soft light + subtle particles
```

Reception:

```text
small sparkles + floating petals
```

Final sunset:

```text
warm particles + fireflies
```

---

# 57. SCENE TRANSITIONS

Although the world is continuous, visual areas can transition gradually.

Do NOT abruptly switch backgrounds.

Use:

* parallax layer transition
* lighting transition
* environmental decoration transition
* color palette transition

Example:

Garden:

```text
green + bright
```

↓

Mosque:

```text
green + gold + ivory
```

↓

Reception:

```text
warm + festive
```

↓

Final:

```text
sunset + gold
```

---

# 58. WORLD DEPTH

Use at least 4 visual depth layers.

```text
Layer 0
Sky / Clouds

Layer 1
Mountains / Distant scenery

Layer 2
Trees / Buildings

Layer 3
Ground / Player

Layer 4
Foreground grass / flowers
```

The camera should move these layers at different speeds.

---

# 59. RESPONSIVE GAME WORLD

The world itself should not be scaled aggressively to fit the screen.

Instead:

* maintain world coordinate system
* adjust viewport
* camera follows player
* mobile sees narrower portion
* desktop sees wider portion

This preserves visual consistency.

---

# 60. MOBILE CONTROL DESIGN

Bottom-left:

```text
◀
```

Bottom-right:

```text
▶
```

Controls:

* fixed position
* safe-area aware
* transparent background
* subtle shadow
* large hit area

Do not cover interactive content.

---

# 61. SAFE AREA

Support:

```css
env(safe-area-inset-bottom)
```

Important for:

* iPhone
* Android devices with gesture navigation

---

# 62. DESKTOP CONTROLS

Keyboard:

```text
← →
```

Optional:

```text
A D
```

Mouse can be used for UI.

Do not require mouse click-and-drag to move.

---

# 63. INTERACTION UX

When player enters a zone:

```text
        🕌

    ✦ Lihat Detail Akad ✦

         🧍
```

Prompt gently bounces.

When clicked:

* player stops
* character faces object
* modal opens

When modal closes:

* player remains at same location
* world resumes

---

# 64. PLAYER AUTO-STOP

If player reaches an interaction object:

Player may automatically stop within the interaction radius.

This prevents the character from walking through the object.

---

# 65. QUICK NAVIGATION AUTO-WALK

If user chooses a location from Quick Navigation:

Example:

`RSVP`

System should:

1. Find RSVP X coordinate.
2. Determine player direction.
3. Move player automatically.
4. Camera follows.
5. Stop at RSVP interaction zone.
6. Show interaction prompt.

Do not teleport.

Optional future feature:

> Skip walking

can teleport directly.

Not required for MVP.

---

# 66. LOADING EXPERIENCE

Show:

```text
Preparing our little world...

🌳
🌸
🏡

████████████ 85%
```

Loading should feel part of the wedding theme.

Avoid technical messages such as:

> Loading Phaser assets...

---

# 67. PERFORMANCE

Target:

* 60 FPS where device allows
* smooth scrolling
* no noticeable input latency
* low memory usage
* optimized mobile assets

Use:

* sprite atlases
* compressed images
* WebP/AVIF
* lazy loading
* asset caching
* limited particles
* texture reuse

Do not create thousands of individual DOM elements for game objects.

---

# 68. FALLBACK MODE

If game fails:

Display a beautiful standard invitation layout.

Minimum sections:

* Couple
* Akad
* Reception
* Location
* RSVP
* Gift

Button:

> **VIEW INVITATION**

This ensures the invitation remains usable.

---

# 69. ACCESSIBILITY

Provide:

* Quick Navigation
* readable text
* large controls
* sufficient contrast
* mute button
* reduced motion option
* keyboard controls
* modal close button
* accessible form labels

Important information must never be hidden exclusively behind gameplay.

---

# 70. REDUCED MOTION

If browser reports:

```text
prefers-reduced-motion: reduce
```

Reduce:

* parallax
* particles
* floating animations
* camera smoothing
* modal animations

Keep functionality intact.

---

# 71. ANALYTICS

Track anonymous interaction events.

Examples:

```text
invitation_opened
game_started
location_visited
couple_opened
story_opened
akad_opened
reception_opened
countdown_opened
gallery_opened
music_started
rsvp_opened
rsvp_submitted
gift_opened
```

Do not collect unnecessary personal data.

---

# 72. SEO

Metadata:

Title:

> Rizky & Aisyah — Wedding Invitation

Description:

> Dengan penuh kebahagiaan, kami mengundang Anda untuk menjadi bagian dari hari istimewa kami.

Open Graph:

* couple photo
* names
* wedding date

---

# 73. URL

MVP:

```text
/wedding
```

Future:

```text
/rizky-aisyah
```

Future SaaS:

```text
/@username/rizky-aisyah
```

---

# 74. GUEST PERSONALIZATION

Support:

```text
/wedding?to=Ahmad%20Family
```

Opening:

> Kepada Yth.
>
> **Ahmad Family**

This is presentation only.

Do not treat the query parameter as authentication.

---

# 75. DATA MODEL

```ts
interface WeddingData {
  slug: string;

  couple: {
    groom: Person;
    bride: Person;
  };

  events: EventData[];

  story: StoryChapter[];

  gallery: GalleryItem[];

  countdown: {
    targetDate: string;
    timezone: string;
  };

  rsvp: RSVPConfig;

  gift: GiftData;

  music: MusicConfig;

  world: WorldConfig;

  theme: ThemeConfig;
}
```

---

# 76. WORLD DATA

```ts
interface WorldConfig {
  width: number;

  locations: WorldLocation[];

  playerStart: {
    x: number;
    y: number;
  };

  parallax: ParallaxConfig;

  ambient: AmbientConfig;
}
```

---

# 77. THEME SYSTEM

Theme must control:

* colors
* typography
* character
* buildings
* environment
* UI
* particles
* music

Example themes for future:

### Theme 01

Cozy Indonesian Village

### Theme 02

Islamic Garden

### Theme 03

Modern Romantic

### Theme 04

Nusantara

### Theme 05

Elegant Sunset

Do not implement all themes in MVP.

Implement one polished theme.

---

# 78. MVP DEFAULT THEME

## "Cozy Indonesian Wedding"

Environment:

* Indonesian house
* lush garden
* tropical trees
* mountains in distance
* mosque
* wedding venue
* flowers
* warm sunlight

Visual style:

> Premium illustrated 2D storybook with subtle game-like movement.

---

# 79. WHAT NOT TO DO

Claude Code must NOT:

* turn the project into a traditional scrolling website
* create separate HTML pages for each section
* make a large open-world RPG
* add combat
* add enemies
* add health bars
* add inventory
* use generic game HUD
* use excessive neon
* make everything pixelated unless the selected theme specifically requires it
* use placeholder-looking UI in the final design
* create giant modal windows that cover the entire experience
* make animations excessive
* force autoplay music
* make movement difficult
* require a tutorial longer than a few seconds

---

# 80. VISUAL QUALITY BAR

The result should feel:

* polished
* premium
* charming
* romantic
* alive
* smooth
* memorable

The visual quality should be closer to:

> an interactive illustrated storybook

than:

> a basic pixel game.

---

# 81. DEVELOPMENT STRATEGY

Do NOT build everything at once.

Build a vertical slice first.

## Milestone 1

Create:

* opening screen
* world
* player
* left/right controls
* camera
* one house
* one interactive zone
* one modal

Goal:

Prove the core interaction.

---

## Milestone 2

Add:

* couple scene
* garden
* story
* parallax
* environment animations

Goal:

Make the world visually impressive.

---

## Milestone 3

Add:

* mosque
* akad
* reception
* countdown
* gallery

Goal:

Complete wedding information experience.

---

## Milestone 4

Add:

* RSVP
* gift
* guestbook
* music
* quick navigation

Goal:

Complete invitation functionality.

---

## Milestone 5

Polish:

* animations
* particles
* transitions
* responsive behavior
* performance
* fallback
* SEO

Goal:

Production-quality MVP.

---

# 82. ACCEPTANCE CRITERIA

## Core World

* [ ] Continuous horizontal world exists.
* [ ] Player can walk left/right.
* [ ] Camera follows player smoothly.
* [ ] World has boundaries.
* [ ] Collision works.
* [ ] Mobile controls work.
* [ ] Desktop keyboard controls work.

## Interactive Locations

* [ ] Home works.
* [ ] Couple works.
* [ ] Story works.
* [ ] Akad works.
* [ ] Reception works.
* [ ] Countdown works.
* [ ] Gallery works.
* [ ] RSVP works.
* [ ] Gift works.

## Animation

* [ ] Player idle animation.
* [ ] Player walking animation.
* [ ] Tree animation.
* [ ] Grass animation.
* [ ] Cloud movement.
* [ ] Ambient particles.
* [ ] At least one environmental ambient animation per major scene.
* [ ] Smooth camera.
* [ ] Modal animation.
* [ ] Interaction prompt animation.

## Mobile

* [ ] Works at 360px width.
* [ ] Buttons are touch friendly.
* [ ] Safe area supported.
* [ ] Modal is responsive.
* [ ] No horizontal page overflow.
* [ ] Game remains playable in portrait.

## Performance

* [ ] Assets optimized.
* [ ] Gallery lazy-loaded.
* [ ] Audio loaded intelligently.
* [ ] No obvious memory leaks.
* [ ] No console errors in production.

---

# 83. FUTURE PRODUCTIZATION

The architecture should eventually support a wedding invitation builder.

Future flow:

```text
CREATE WEDDING
      ↓
SELECT THEME
      ↓
UPLOAD COUPLE PHOTOS
      ↓
ENTER WEDDING DATA
      ↓
CUSTOMIZE CHARACTER
      ↓
CUSTOMIZE WORLD
      ↓
ADD STORY
      ↓
ADD GALLERY
      ↓
CONFIGURE RSVP
      ↓
CONFIGURE GIFT
      ↓
PREVIEW
      ↓
PUBLISH
```

The underlying game engine remains the same.

Only the data and assets change.

---

# 84. FUTURE WORLD EDITOR

Future admin interface should allow:

* reorder locations
* enable/disable sections
* change location position
* change building
* change character
* upload images
* select theme
* change colors
* select music
* configure events

Example:

```text
WORLD EDITOR

[Home] ─ [Couple] ─ [Story] ─ [Akad] ─ [Reception] ─ [RSVP]

              ← DRAG TO REORDER →
```

Not part of MVP.

---

# 85. FINAL EXPERIENCE GOAL

The final guest experience should feel like this:

### 1

Open WhatsApp invitation.

### 2

Tap URL.

### 3

Beautiful animated opening appears.

### 4

Tap:

> ENTER OUR WORLD

### 5

Character appears in a beautiful 2D environment.

### 6

Guest presses:

> ▶

Character starts walking.

### 7

Guest discovers the couple.

> 💑 Kenali Kami

### 8

Guest interacts.

Beautiful modal opens.

### 9

Guest continues walking.

The environment changes.

### 10

Guest discovers:

> 📖 Our Story

### 11

Continues to:

> 🕌 Akad Nikah

### 12

Then:

> 🏛️ Reception

### 13

Then:

> 🕰️ Countdown

### 14

Then:

> 📸 Gallery

### 15

Then:

> 💌 RSVP

### 16

Then:

> 🎁 Wedding Gift

### 17

Finally reaches a beautiful sunset scene.

Text:

> **Thank you for being part of our story.**
>
> With love,
>
> **Rizky & Aisyah ❤️**

---

# 86. CRITICAL INSTRUCTION FOR CLAUDE CODE

Build this as an **interactive 2D side-scrolling world**, not as a traditional wedding website.

The player must physically move through the world using left/right controls.

The world must be continuous.

Sections must exist as physical locations inside the world.

Information must open through interactive objects/zones and React modals.

The game world should remain visible behind the modal.

The environment should have subtle, beautiful animation.

Use layered parallax, ambient particles, character animation, environmental movement, and smooth camera movement to create depth and life.

The animation style must be elegant and restrained.

The experience should feel:

**romantic + premium + charming + alive**

not:

**arcade + childish + RPG + overly gamified.**

Prioritize mobile.

Do not over-engineer.

First prove this core loop:

```text
OPEN
 ↓
ENTER WORLD
 ↓
CHARACTER
 ↓
WALK LEFT / RIGHT
 ↓
CAMERA FOLLOWS
 ↓
DISCOVER LOCATION
 ↓
INTERACTION PROMPT
 ↓
OPEN MODAL
 ↓
READ INFORMATION
 ↓
CLOSE MODAL
 ↓
CONTINUE WALKING
```

If this loop feels excellent, the entire product will work.

Do not move to advanced features until this core interaction is polished.
