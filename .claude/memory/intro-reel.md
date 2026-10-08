---
name: intro-reel
description: 15-second intro video section between StackStrip and Experience
type: project
---
The homepage has a 15s intro video (src/components/IntroReel.astro, files in public/media/intro-*.mp4/.jpg).
Desktop gets the 16:9 cut, phones in portrait (max-width 700px) get the 9:16 cut. It lazy-loads when the
section scrolls near. At 60% visible it restarts and plays WITH sound once the visitor has clicked/tapped/pressed
a key anywhere (browsers block audible autoplay before that; scrolling does not count), otherwise muted with a
"Tap for sound" hint. Scrolled away: mute + pause. One audible pass per visit, then silent loop.
Scroll motion (progress bar, hero drift, timeline rail fill, staggered reveals, reel scale-in) lives in Base.astro.
The video is the no-NV1 "public" cut, rendered in its own navy/white/orange palette.
Why: Michael wanted the intro reel on the site; landscape for desktop, vertical for mobile.
How to apply: to swap the video, replace the four files in public/media/ keeping the same names.
