# LANE-HERALD-25 — Mobile Lane Card

WAVE_ID: `2026-09-25-j-keel`
Repo: `DubjamMusic/hustlecodex-mobile-app`
Merge policy: **pr-only**

## Job
Bind the four tab lanes (home, console, opportunities, profile) as a scored glance card without rewriting Expo routes. This is not pocket-herald (Wave C circuit). New figure, new path, new wave id.

## Responsibilities
- Own `lanes.json` only.
- Print a reproducible density to three decimals.
- Keep merge policy pr-only.

## Knowledge required
- Density = (N^wN * V^wV * S^wS * D^wD)^(1 / totalWeight).
- Lanes score glance tabs; they do not touch oauth secrets or drizzle schema.
- Chair holds merge.

## Primary path this wave
`figures/lane-herald/**` only.

## Out of scope
Do not rewrite `app/(tabs)/*` or `constants/oauth.ts` this wave. Auth drift is a separate issue.
