# Day 2 Content Prep

## Goal

Prepare reusable content files before starting the frontend setup so the project has a clear source of truth from day one.

## What Was Prepared

- identity and hero content
- page copy for all public pages
- projects data
- practicals data
- services data
- blogs metadata
- contact and receipt configuration
- stats placeholders
- testimonial placeholder file

## Why This Matters

This setup helps the project in three ways:

1. The frontend can consume clean content without hardcoded text.
2. The backend can reuse the same shape later for seeding or admin editing.
3. Personal content stays easy to update without touching component code.

## Folder Decision

All reusable content is stored inside `content/`.

This allows the frontend setup to begin with:

- reusable page sections
- mapped project cards
- mapped services
- mapped blog cards
- configurable hero and contact data

## Honest Gaps Still Marked As TBD

- real testimonials

## Content Decisions Locked Today

- use polished but natural copy
- avoid fake testimonials
- keep stats manual in version 1
- keep service descriptions clear and student-friendly
- keep the security service legally safe and approval-based
- include downloadable payment acknowledgement in the final flow

## Day 2 Outcome

Day 2 is complete when:

- content is reusable
- missing values are clearly marked
- no important text is trapped inside docs only
- frontend setup can begin with stable content
