# 999x Frontend Overhaul & Enhancement Plan

## Goal Description
Based on your feedback in the audio recording, we are overhauling several aspects of the platform to improve realism, usability, and the overall premium feel of the product. The key objectives are:
1. **Remove Fake/Mock Data**: Purge all hardcoded mock data fallbacks across Admin pages. If the database is empty or fails, we will show a clean empty state and log the error to the console.
2. **"Edit Anything" (Inline Editability)**: Introduce a global inline-edit capability so that clicking on data (like task titles, company names, etc.) allows immediate editing and saving to the backend.
3. **Event Management (Sponsors Redesign)**: Recontextualize the "Sponsors" section to act as an "Event Management" أو "إدارة المؤتمرات" portal, since 999x organizes events for these companies.
4. **Legendary Landing Page**: Give the `Landing.tsx` page a massive aesthetic upgrade with smoother animations, richer micro-interactions, and a truly premium Neo-Cyber feel.

> [!WARNING]
> **User Review Required**
> 1. For "Edit Anything", I will build a reusable `<InlineEdit />` component and apply it to key fields in the CRM, Cockpit, and Prospects pages.
> 2. For the Sponsor page, I will rename it to "Event Ops Studio" and adjust the terminology.

## Proposed Changes

---
### 1. Remove Mock Data Fallbacks
#### [MODIFY] `AdminProspects.tsx`, `AdminCockpit.tsx`, `ClientRoadmap.tsx`, `SponsorStudio.tsx`
- Remove all `catch` blocks that fallback to static arrays of mock data.
- Replace them with `console.error(err)` and set the state to an empty array `[]`.
- Ensure the UI handles `data.length === 0` gracefully by showing a clean "No records found" empty state.

---
### 2. "Edit Anything" Capability
#### [NEW] `apps/web/src/components/ui/InlineEdit.tsx`
- A reusable component that switches from text to an input field on click, handles `Enter`/`Escape`, and fires an `onSave` callback.
#### [MODIFY] `AdminCRM.tsx`, `AdminCockpit.tsx`, `AdminProspects.tsx`
- Wrap editable fields (e.g., Company Names, Task Titles, Client details) in the `<InlineEdit />` component.
- Wire `onSave` to trigger the respective `PATCH` API request to update the record in MongoDB.

---
### 3. Sponsors Redesign -> Event Partners
#### [MODIFY] `SponsorStudio.tsx`
- Rename references from "Sponsors" to "Event Partners" or "Event Organization".
- Modify the AI Tier generation to reflect packages you offer *to organize their events* (e.g., Event Planning, Marketing, Full Execution).
- Adjust the terminology on the page (Pitch Deck -> Event Proposal, etc.).

---
### 4. Legendary Landing Page
#### [MODIFY] `Landing.tsx`
- Redesign the hero section with a dynamic, particle-based or animated glassmorphism background.
- Improve typography using high-contrast neon accents (Lime/Emerald).
- Add scroll-triggered reveal animations using Intersection Observer.
- Enhance the 360° Pulse Check form to look like a futuristic HUD terminal.

## Verification Plan
### Automated Tests
- Run `bun run tsc --noEmit` to ensure no TypeScript errors from the new `InlineEdit` component and state changes.
### Manual Verification
- Verify the Landing page visually across desktop and mobile.
- Test loading pages with an empty database to confirm no mock data appears and errors log to the console.
- Click on a text field in the CRM, modify it, and verify the UI and backend update seamlessly.
