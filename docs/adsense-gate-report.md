# AdSense Gate Report — yuliusbox.com (2026-11-05)

Branch: `fix/adsense-reapplication`. Rerun outputs:
`~/workspace/agy-briefs/audit-{completeness,technical,crawl,text-depth,duplicates}-rerun-20261105.txt`
(plus `audit-technical-prod-20261105.txt` for the production-host run).
Baseline (2026-11-05, pre-change): `audit-text-depth-20261105.txt`,
`audit-duplicates-20261105.txt`, `/tmp/audit-completeness.txt`,
`/tmp/audit-technical.txt` (conclusions recorded in the merged plan).

Reruns were executed against the local production build
(`npm run build`, `next start -p 3100`), except `check_technical.py`,
which was also run against `https://www.yuliusbox.com` because the
localhost run cannot observe HTTPS or the production sitemap host.
Target: zero FAIL, zero NEW warnings vs baseline.

## Results

| Script | Result | vs baseline |
|---|---|---|
| `check_completeness.py` (`--nav-limit 50`) | **5/5 PASS, exit 0.** All 42 nav links followed, none broken. | Baseline: 4 PASS + 2 WARN, both WARNs from the footer mailto → `/cdn-cgi/l/email-protection` 404. **Both WARNs eliminated** by the footer fix. (At default `--nav-limit 25` the run reports MISS on coverage, 25/42 links — a limit, not a finding; re-ran at 50 to close it.) |
| `check_technical.py` (production host) | **3 PASS + 1 note (uptime not observable), exit 0.** Robots allows Mediapartners-Google, Googlebot, AdsBot; sitemap 73 URLs, 5/5 sampled 200. | Identical to baseline. |
| `check_technical.py` (localhost) | 2 PASS + 2 WARN — both WARNs are localhost artifacts (plain HTTP, not HTTPS; robots points at the production sitemap host). Not a site regression. | N/A (baseline was production-only). |
| `crawl_site.py` (`--depth 2 --max-pages 80 --verify-canonical`) | **3 PASS + 1 note, exit 0.** 80 pages fetched, 80 readable HTML, 0 blocked by robots, 0 redirects, max 0 hops. Note: canonicals point at the production domain (expected on localhost) and are stable across sessions. | Baseline had no crawl run recorded; no FAIL. |
| `analyze_text_depth.py` (73 URLs) | **72 PASS + 1 note (contact, borderline 404 words — contact page by nature), exit 0.** | Baseline: 73/73 PASS-or-note, same single note. No page below 300 words. |
| `check_duplicates.py` (73 URLs) | **PASS: no near-duplicate groups.** `ADS-CONTENT-OVERLAP` MISS by design (script performs no web search). | Identical to baseline; overlap covered manually by the Phase 3 competitor comparison (`docs/adsense-competitor-notes.md`). |

**Gate verdict: PASS.** Zero FAIL in all five scripts; zero new WARNs
(the only WARNs are the two localhost-environment artifacts in the
technical run, and the production run is clean).

## Sitemap / Soft-404 statement

- Sitemap advertises 73 URLs; every one of them is a **keep** decision in
  `docs/adsense-reapplication-decisions.md`. No URL was redirected or
  deleted in this change, so there are no retired URLs to de-index and no
  301/410 chains to verify.
- Crawl found 0 redirects and 0 blocked pages; completeness found 0 broken
  nav links. No Soft 404 observed on the local build.
- The 9 intentional `noindex` pages are unchanged and remain out of the
  sitemap.

## Post-deploy recheck (for the deployer — NOT done in this branch)

Do not click AdSense reapply until all of these hold:

1. Deploy this branch (PR, CI green, merge) and confirm the live site
   serves the new content (spot-check `/`, `/tools`,
   `/tools/video-to-gif` SSR HTML).
2. In GSC URL Inspection, re-check the 15 previously unindexed/unknown
   URLs (13 Discovered + word-to-pdf + video-to-gif-for-discord). The user
   must request indexing manually in the GSC web UI — there is no API for
   it, and this task deliberately did not do it.
3. **Hard gate:** every kept page's `lastCrawlTime` in the GSC census is
   later than the deploy time. Re-run the census
   (`~/workspace/agy-briefs/gsc-census-20261105.py`) and compare.
4. Confirm no new coverage errors (Soft 404, redirect errors) appeared
   after deployment.
5. Only then click AdSense "Request review" — that click is the user's,
   in their own AdSense account, not part of this change.

## Verification performed on this branch (2026-11-05)

- `npm run build`: exit 0 (95 routes).
- `npm run seo-check` (local server :3100): **73/73 pages passed.**
- SSR spot checks: 5 main pages HTTP 200; measured numbers present in
  server HTML (video-to-gif 363.3 KB / 48x / 7.6 KB; audio-to-text
  79.39 / 251.59 MB); `/` links video-to-gif-for-discord; word-to-pdf
  mentions LibreOffice/Gotenberg.
- COEP: `Cross-Origin-Embedder-Policy: credentialless` confirmed in
  response headers for video-to-gif, audio-to-text, background-remover.
- Playwright/Chromium render check (local server :3100, no relay needed
  for localhost): **performed 2026-11-05** — `/`, `/tools/video-to-gif`,
  `/tools/audio-to-text`, `/tools/background-remover`,
  `/tools/word-to-pdf` all render with their H1 and full body text
  (7,257–13,775 visible chars), **0 page errors**. (An earlier plan to
  run this via the `proxy-relay.mjs` relay was unnecessary for a
  localhost target; the relay exists for external-site fetches.)
