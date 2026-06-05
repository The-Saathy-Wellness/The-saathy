# Components structure (non-invasive)

I created suggested folders under `src/components/` and added this mapping without changing any existing component code.

## Proposed folders
- src/components/layout
- src/components/sections
- src/components/ui
- src/components/pages

## Current -> Suggested name
- `FrameComponent1.tsx` -> `Header.tsx` (layout)
- `FrameComponent11.tsx` -> `Hero.tsx` (sections)
- `FrameComponent1111.tsx` -> `Features.tsx` (sections)
- `FrameComponent11111.tsx` -> `HowItWorks.tsx` (sections)
- `FrameComponent111111.tsx` -> `Pricing.tsx` (sections)
- `FrameComponent1111111.tsx` -> `FAQ.tsx` (sections)
- `FrameComponent11111111.tsx` -> `Testimonials.tsx` (sections)
- `FrameComponent111111111.tsx` -> `Team.tsx` (sections)
- `FrameComponent1111111111.tsx` -> `Gallery.tsx` (sections)
- `FrameComponent11111111111.tsx` -> `BlogPreview.tsx` (sections)
- `FrameComponent111111111111.tsx` -> `Contact.tsx` (sections)
- `FrameComponent1111111111111.tsx` -> `Footer.tsx` (layout)
- `Frame1554.tsx` -> `About.tsx` (sections/pages)
- `Card1HumanListenerChat.tsx` -> `ChatCard.tsx` (ui)
- `Container.tsx` -> `Container.tsx` (layout)
- `SectionFinalCTA.tsx` -> `FinalCTA.tsx` (sections)

## Notes
- No component code was modified.
- CSS module files were not renamed. If you approve renames, I can:
  1) Move and rename files and update imports across the `src` tree (this will modify code), or
  2) Add lightweight re-export wrappers that keep original files but provide new names/paths.

## Next steps (pick one)
- `apply-renames` — move/rename files and update imports (code changes required).
- `add-reexports` — create re-export files under the new folders so you can import by new paths without changing originals.
- `do-nothing` — keep current files as-is.

Reply with which next step you want. If you want `apply-renames`, say so and I will proceed (I will update imports).