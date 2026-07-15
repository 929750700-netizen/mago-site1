# HANDOFF

## Task

We are deploying the `mago-site` Next.js website from local development to a public production-like environment.

Original goals:

- Make the local website publicly accessible.
- Deploy the site to Vercel.
- Store `/studio` CMS content in Supabase instead of local JSON when deployed.
- Use GitHub as the source repository for Vercel.
- Optionally bind a custom/free domain and use Cloudflare if a real domain is available.

Current project path:

```text
D:\mago-site
```

GitHub repository:

```text
https://github.com/929750700-netizen/mago-site1
```

Current live Vercel URL:

```text
https://mago-site1-sandy.vercel.app
```

The user is in China / Asia-Shanghai environment. Access to `vercel.app` may require VPN or a different network.

## Completed

### Local Network Access

The local Next.js dev server was changed to listen on all interfaces:

```json
"dev": "next dev -H 0.0.0.0",
"start": "next start -H 0.0.0.0"
```

Local LAN URL that worked during setup:

```text
http://192.168.2.180:3000
```

This is only for LAN testing. Public access now uses Vercel.

### Image Optimization

The original images were slow. Large images were converted to WebP and placed in:

```text
public/media/optimized
```

Important compression results:

- `afro-sunset-poster.png`: about `8.3MB` to about `216KB`
- multiple event/gallery images: about `1.7-2.2MB` to about `90-190KB`
- hero image: about `1.7MB` to about `108KB`

References were updated in:

- `src/components/Hero.tsx`
- `src/data/site.json`
- `src/app/globals.css`
- `src/components/WechatSection.tsx`
- `src/components/StudioDashboard.tsx`
- `src/app/layout.tsx`

### GitHub

The local repo was initialized and pushed to:

```text
https://github.com/929750700-netizen/mago-site1
```

Branch:

```text
main
```

Latest important pushed commit during this work:

```text
7f269a5 Avoid build-time Supabase failures
```

### Supabase

The user created a Supabase project named roughly:

```text
mago-site
```

The Supabase project URL visible in screenshots:

```text
https://mtwovdjujiveppkbmhfo.supabase.co
```

The user created this table and RLS policies:

```sql
create table if not exists public.site_content (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

drop policy if exists "Anyone can read published site content" on public.site_content;
create policy "Anyone can read published site content"
on public.site_content
for select
to anon, authenticated
using (id = 'main');

drop policy if exists "Service role can manage site content" on public.site_content;
create policy "Service role can manage site content"
on public.site_content
for all
to service_role
using (true)
with check (true);
```

Why a single `site_content` table:

- The existing CMS stores one full `SiteData` JSON object.
- Using one JSONB row minimized code changes and risk.
- Row id is fixed as:

```text
main
```

### Supabase Code Integration

Installed dependency:

```text
@supabase/supabase-js
```

Content storage logic is in:

```text
src/lib/content.ts
```

Behavior:

- If `SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY` are present, server-side reads/writes use Supabase table `site_content`.
- If Supabase data row does not exist, the app falls back to local `src/data/site.json` and attempts to seed Supabase.
- If Supabase read/write fails, the app logs a warning and falls back to local JSON so Vercel builds do not crash.
- If no Supabase env vars exist locally, `/studio` continues to write local `src/data/site.json`.

Important security point:

- `SUPABASE_SERVICE_ROLE_KEY` is server-only.
- Never expose it in frontend code, GitHub, screenshots, or chat.
- It must never use a `NEXT_PUBLIC_` prefix.

### Vercel

Project was imported from GitHub and deployed successfully.

Current Vercel production domain:

```text
https://mago-site1-sandy.vercel.app
```

The user confirmed:

- Vercel deployment succeeded.
- The site can open when using VPN.
- `/studio` login works.
- The backend is "好使" according to the user.

Environment variables added in Vercel:

```text
SUPABASE_URL=https://mtwovdjujiveppkbmhfo.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://mtwovdjujiveppkbmhfo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<Supabase Publishable key>
SUPABASE_SERVICE_ROLE_KEY=<Supabase Secret key>
CMS_ADMIN_PASSWORD=<user-chosen studio password>
SESSION_SECRET=<user-chosen long random string>
NEXT_PUBLIC_SITE_URL=https://mago-site1-sandy.vercel.app
```

The user originally set `NEXT_PUBLIC_SITE_URL` to `https://mago-site1.vercel.app`, then later changed it to:

```text
https://mago-site1-sandy.vercel.app
```

If deployment behavior looks stale, redeploy from Vercel after env changes:

```text
Project -> Deployments -> latest deployment -> three-dot menu -> Redeploy
```

### Build Fix

First Vercel deployment failed during static page generation.

Cause was likely build-time Supabase access from pages/routes that read `getSiteData()`.

Fix:

- Added safe fallback in `src/lib/content.ts`.
- Added dynamic rendering to:
  - `src/app/not-found.tsx`
  - `src/app/sitemap.ts`

Local verification passed:

```text
pnpm typecheck
pnpm build
```

Local Node warning:

- Local machine had Node `20.18.0`.
- `package.json` now requires:

```json
"engines": {
  "node": ">=22.13.0"
}
```

Vercel should use Node 22+ according to `engines`.

### Free Domain Attempt

The user registered:

```text
711.bbroot.com
```

Vercel domain add showed:

```text
Verification Needed
```

Vercel required:

```text
CNAME 711 -> f07173d904af4504.vercel-dns-017.com
TXT _vercel -> vc-domain-verify=711.bbroot.com,7a9fde8301455e9bbac4
```

Because the bbroot DNS panel manages `711.bbroot.com` as the current zone, the records created were:

```text
@       CNAME f07173d904af4504.vercel-dns-017.com
_vercel TXT   vc-domain-verify=711.bbroot.com,7a9fde8301455e9bbac4
```

Actual DNS resolution confirmed:

```text
711.bbroot.com CNAME f07173d904af4504.vercel-dns-017.com
_vercel.711.bbroot.com TXT vc-domain-verify=711.bbroot.com,7a9fde8301455e9bbac4
```

But Vercel specifically wanted:

```text
_vercel.bbroot.com
```

That cannot be added by the user because they do not control the parent `bbroot.com` zone.

Conclusion:

- Do not keep trying to make `711.bbroot.com` work unless bbroot support can add `_vercel.bbroot.com`.
- User decided to continue using the free Vercel domain instead.

## Current State

The active public website URL is:

```text
https://mago-site1-sandy.vercel.app
```

The user has decided:

```text
Continue using the Vercel free domain.
Do not buy a domain for now.
Do not continue Cloudflare/WAF setup for now.
```

The site may require VPN from the user's current network because `vercel.app` timed out without VPN. The user confirmed that with VPN it opens.

Important distinction explained to user:

- `http://192.168.2.180:3000` is LAN-only local dev.
- `https://mago-site1-sandy.vercel.app` is public Vercel cloud deployment and works even when the user's PC is off.

## Next Steps

Proceed with final verification checklist for the Vercel free-domain deployment.

Recommended checks:

1. Open homepage:

```text
https://mago-site1-sandy.vercel.app
```

Confirm:

- Homepage loads.
- Images load.
- Navigation works.
- Event cards show correctly.

2. Open CMS:

```text
https://mago-site1-sandy.vercel.app/studio
```

Confirm:

- Login works with `CMS_ADMIN_PASSWORD`.
- Edit a harmless field.
- Save.
- Refresh.
- Confirm saved data persists.

3. Confirm Supabase has data:

In Supabase Table Editor, open:

```text
site_content
```

Confirm:

- Row `id = main` exists.
- `data` JSON contains site settings/events/gallery/etc.
- `updated_at` changes after CMS save.

4. Check Vercel environment variables:

Ensure these are present for Production and Preview:

```text
SUPABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
CMS_ADMIN_PASSWORD
SESSION_SECRET
NEXT_PUBLIC_SITE_URL
```

5. Check security:

- No `.env` or `.env.local` committed to GitHub.
- No `SUPABASE_SERVICE_ROLE_KEY` in browser DevTools Network/Sources.
- No secret keys shown in screenshots or chat.

6. Optional cleanup:

Remove failed custom domain from Vercel:

```text
Project -> Settings -> Domains -> 711.bbroot.com -> remove/delete
```

This avoids ongoing red warnings.

## Known Pitfalls: Do Not Repeat

### Do Not Treat `bbroot.com` Free Subdomain as Fully Owned Domain

`711.bbroot.com` is only a subdomain. The user cannot create records at:

```text
_vercel.bbroot.com
```

So Vercel verification fails when the parent domain is linked to another Vercel account.

Do not keep telling the user to add `_vercel` under `711.bbroot.com`; that already created `_vercel.711.bbroot.com`, which is not what Vercel wanted.

### Do Not Put `/rest/v1/` in Supabase URL

On Supabase Data API page, it shows:

```text
https://mtwovdjujiveppkbmhfo.supabase.co/rest/v1/
```

For env vars, use only:

```text
https://mtwovdjujiveppkbmhfo.supabase.co
```

Correct:

```text
SUPABASE_URL=https://mtwovdjujiveppkbmhfo.supabase.co
NEXT_PUBLIC_SUPABASE_URL=https://mtwovdjujiveppkbmhfo.supabase.co
```

Wrong:

```text
SUPABASE_URL=https://mtwovdjujiveppkbmhfo.supabase.co/rest/v1/
```

### Do Not Expose `SUPABASE_SERVICE_ROLE_KEY`

The service key is powerful.

Never:

- Ask the user to paste it in chat.
- Add it to GitHub.
- Prefix it with `NEXT_PUBLIC_`.
- Use it in client-side code.

Only use it as Vercel server-side environment variable:

```text
SUPABASE_SERVICE_ROLE_KEY
```

### Do Not Duplicate Vercel Environment Variable Names

The user accidentally added `SUPABASE_URL` twice. Vercel showed:

```text
A variable with the name `SUPABASE_URL` already exists
```

Each key must appear once:

```text
SUPABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
CMS_ADMIN_PASSWORD
SESSION_SECRET
NEXT_PUBLIC_SITE_URL
```

### Do Not Assume `vercel.app` Opens Without VPN

The user's local network timed out on:

```text
https://mago-site1-sandy.vercel.app
```

Network test failed:

```text
TcpTestSucceeded: False
```

With VPN it opened successfully. If the user says "cannot access", first ask them to try VPN or another network before debugging app code.

### Do Not Depend on Local Node 20

Local machine has Node:

```text
v20.18.0
```

Supabase JS now warns that Node 20 and below are deprecated. Vercel should use Node 22+ because `package.json` has:

```json
"engines": {
  "node": ">=22.13.0"
}
```

Local builds still passed with warning, but production should stay on Node 22+.

### Do Not Use Global `pnpm` Blindly

Global pnpm required Node `>=22.13`, while local machine had Node 18 in PATH originally. We used:

```text
D:\node-v20.18.0-win-x64\node.exe
```

and installed local pnpm under:

```text
.tools
```

`.tools` is ignored by Git.

Project package manager:

```json
"packageManager": "pnpm@9.15.9"
```

### Do Not Delete User Work or Reset Git

This repo has real deployed work. Avoid destructive git commands. Use normal commits and pushes.

## Useful Commands

From:

```text
D:\mago-site
```

Run local typecheck/build using the local Node path:

```powershell
$env:Path='D:\node-v20.18.0-win-x64;' + $env:Path
D:\node-v20.18.0-win-x64\node.exe .\.tools\node_modules\pnpm\bin\pnpm.cjs typecheck
D:\node-v20.18.0-win-x64\node.exe .\.tools\node_modules\pnpm\bin\pnpm.cjs build
```

Run local dev server:

```powershell
$env:Path='D:\node-v20.18.0-win-x64;' + $env:Path
D:\node-v20.18.0-win-x64\node.exe .\.tools\node_modules\pnpm\bin\pnpm.cjs dev
```

Git status/push:

```powershell
git status --short
git add .
git commit -m "message"
git push
```

## User Preferences / Process

The user wants step-by-step deployment guidance, not a giant all-at-once dump.

When continuing:

- Give one stage at a time.
- Ask for confirmation before moving to the next stage.
- Use Chinese.
- Keep instructions practical and concrete.
- For secrets, tell the user where to paste them but do not ask them to send the values.

