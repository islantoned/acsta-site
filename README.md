# ACSTA Website

Static site — no build step. Every word and image on the homepage lives in `content/homepage.json`
and is edited through the point-and-click admin at `/admin` once the site is on Netlify.

```
index.html            layout (no copy in here)
styles.css            design — colors, fonts, spacing
app.js                renders content/homepage.json into the layout
content/homepage.json ALL homepage words, prices, links, image paths  ← the only file you edit
images/uploads/       images uploaded through the admin land here
admin/                Decap CMS (the editor) — index.html + config.yml
scripts/              Google Apps Script for the subscribe form
netlify.toml          hosting + security headers
```

## Going live on Netlify (one time)

1. Put this folder's CONTENTS (not the zip) in the GitHub repo `islantoned/acsta-site`, branch `main`.
2. netlify.com → Sign up with GitHub → **Add new project → Import an existing project → GitHub** → pick `acsta-site`.
   Build command: *(empty)*. Publish directory: `.` → Deploy.
3. Admin login (Log in with GitHub):
   - GitHub → profile → Settings → Developer settings → OAuth Apps → New OAuth App.
     Homepage URL: `https://americancosmeticspraytan.org`
     Authorization callback URL: `https://api.netlify.com/auth/done`
   - Copy the Client ID; generate and copy a Client secret.
   - Netlify → project → Project configuration → Security → OAuth → Install provider → GitHub → paste both.
4. Open `https://YOUR-SITE/admin/` → **Login with GitHub** → edit → **Publish**. The site updates in about a minute.
5. Domain: Netlify → Domain management → Add domain → `americancosmeticspraytan.org` → Set up Netlify DNS →
   copy the four nameservers into your domain registrar's Nameservers setting. HTTPS issues itself once DNS resolves.

## Subscribe form → Google Sheet

Follow the steps at the top of `scripts/google-sheet-apps-script.gs`, then paste the Web app URL into
Admin → **Subscribe Form → Google Apps Script Web App URL**. Until it's set, the form shows a
"not connected yet" message instead of pretending to work.

Spam protection: hidden honeypot field + 3-second time trap in the browser, email validation and
de-duplication in the Apps Script. No credentials of any kind are in the site code.

## Changing the design

`styles.css`, top block (`:root`). `--sun` is marked PLACEHOLDER until the original yellow hex is confirmed.
