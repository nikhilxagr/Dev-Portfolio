# Day 3 Visual System

## Goal

Create a visual system that feels consistent, modern, and distinct from generic portfolio templates.

## Brand Personality

- professional
- sharp
- curious
- disciplined
- technical without feeling cold

## Theme Direction

The portfolio should feel like:

- a real developer portfolio
- a cyber security learner's workspace
- a clean personal brand, not a gaming dashboard

## Color Tokens

### Core Surfaces

- `bg.canvas`: `#EAFBF4`
- `bg.sectionSoft`: `#D9F7EA`
- `bg.card`: `#0B1F3A`
- `bg.cardSecondary`: `#12345A`
- `bg.deep`: `#081626`

### Accent Colors

- `accent.primary`: `#4ADE80`
- `accent.soft`: `#84F3C5`
- `accent.highlight`: `#B5FFD8`

### Text

- `text.primaryOnLight`: `#0E223F`
- `text.secondaryOnLight`: `#3D5A73`
- `text.primaryOnDark`: `#EAFBF4`
- `text.mutedOnDark`: `#A9C7C1`

### Utility

- `border.soft`: `rgba(11, 31, 58, 0.12)`
- `border.strong`: `rgba(132, 243, 197, 0.24)`
- `shadow.card`: `0 18px 50px rgba(8, 22, 38, 0.16)`

## Typography

- heading font: `Space Grotesk`
- body font: `Manrope`
- mono accent font: `JetBrains Mono`

## Typography Scale

- hero display: `56px desktop / 38px mobile`
- section title: `36px desktop / 28px mobile`
- card title: `22px desktop / 20px mobile`
- body: `16px to 18px`
- helper text: `14px`

## Shape Language

- cards: rounded but not too soft
- radius: `20px` for main cards, `14px` for smaller elements
- buttons: pill or soft rounded rectangles
- profile image frame: layered card style, not a plain circle crop

## Surface Style

- use dark blue cards over pale green sections
- use faint gradients instead of flat backgrounds
- use subtle line patterns or grid texture in hero and footer
- avoid too many glassmorphism effects

## Motion Direction

- section fade-up on reveal
- card hover lift of `4px` to `6px`
- button glow only on hover
- no flashy looping animations

## Icon And Graphic Direction

- use minimal line icons
- add terminal, shield, code, and network motifs carefully
- visual hints of cyber security should stay subtle

## Photography Direction

- use the provided profile image as the primary portrait
- place it inside a dark framed card with green accent edge
- avoid busy cutout effects in version 1

## Testimonials Decision

Testimonials mean short feedback from people who worked with you, learned from you, or received your help.

Examples:

- a classmate you guided
- someone whose resume you improved
- someone whose small project or portfolio you reviewed

Since you do not have real testimonials yet:

- hide the testimonials section in version 1
- add it later only after collecting real feedback

## Implementation Notes

- the hero should feel premium without being crowded
- the practicals and services cards should share the same card system
- the site should look designed, not auto-generated
- keep copy readable and avoid oversized paragraphs

## Day 3 Outcome

Day 3 is complete when:

- color system is locked
- typography is locked
- motion style is locked
- testimonial handling is decided
- frontend build can follow one consistent visual language
