# Future Light — Implementation Plan

## ရွေးချယ်ထားသော architecture

လက်ရှိ sandbox တွင် Android SDK/Gradle မရှိသဖြင့် **dependency မလိုသော mobile-first static web application** အဖြစ် ပထမ release ကို တည်ဆောက်ထားသည်။ Android ဖုန်းတွင် browser/PWA အဖြစ် ချက်ချင်းအသုံးပြုနိုင်ပြီး နောက်ပိုင်းတွင် Capacitor သို့မဟုတ် Trusted Web Activity ဖြင့် native wrapper သို့ ပြောင်းနိုင်သည်။ Server/database မသုံးဘဲ project data ကို browser `localStorage` တွင် သိမ်းဆည်းထားသဖြင့် အခြေခံ code editing သည် အခမဲ့ဖြစ်သည်။

- Application identity: `Future Light`
- Web prototype version: `1.0.0`
- Android application ID (future wrapper): `com.futurelight.editor`
- Runtime: plain HTML, CSS, ES modules, no paid API or external dependency
- Persistence: `localStorage` project store + recovery snapshot
- Preview: `iframe.srcdoc` ဖြင့် HTML/CSS/JavaScript ကို local sandbox ထဲတွင် preview
- Distribution: `manifest.webmanifest` ပါသော installable PWA foundation; APK/AAB ကို ဤ sandbox တွင် မတည်ဆောက်နိုင်သေး

## Project structure

```text
index.html                 Main app shell and accessible controls
styles.css                 Responsive design system, light/dark themes
js/storage.js              Local project model, import/export and recovery
js/syntax.js               Lightweight syntax highlighter for HTML/CSS/JS/JSON/text
js/app.js                  UI state, editor interactions and event wiring
public/icon.svg             Original Future Light mark
public/favicon.svg          Browser favicon
public/manus-routes.json    Webdev route manifest
manifest.webmanifest       PWA metadata
app.config.ts              Webdev logo metadata placeholder/config
README.md                   Burmese phone-friendly setup and usage guide
CHANGELOG.md                Release history template
RELEASE_CHECKLIST.md        Repeatable release and Play Store checklist
```

## Design direction

- **Design movement:** utilitarian neo-brutalism blended with a calm “night lab” developer workspace.
- **Core principles:** fast access, visible state, safe recovery, and readable code on a small screen.
- **Color philosophy:** ink navy and graphite reduce eye strain; Future Lime is the ownable accent for active editor state; amber signals unsaved work without looking like an error.
- **Layout paradigm:** persistent explorer rail + focused editor canvas + optional preview drawer, rather than a centered dashboard grid.
- **Signature elements:** lime “beam” mark, thin orbital separators, and file-type color chips.
- **Interaction philosophy:** every state-changing action has immediate feedback through tab dots, status text, toast messages, and disabled/active styling.
- **Animation:** short 160–220ms transitions for drawers, buttons and toast entry; no distracting looping motion.
- **Typography:** system UI stack for Burmese/Android compatibility, with `ui-monospace` for code and numeric status values.
- **Brand essence:** a focused, recoverable code bench for building on a phone — calm, capable, portable.
- **Personality:** precise, bright, dependable.
- **Brand voice:** direct and encouraging. Examples: “သင့် code ကို ဆက်ရေးပါ။ မသိမ်းရသေးတာကို Future Light က သတိပေးမည်။” and “Preview ကို ဖွင့်ပြီး ပြင်ဆင်ချက်ကို ချက်ချင်းကြည့်ပါ။”
- **Wordmark/logo:** an original tilted beam `F` built from two rounded bars and a small orbit dot, paired with the Future Light wordmark.
- **Signature brand color:** Future Lime `#c7f36b`.

## Implemented behavior target

1. File/folder tree, create, import, rename, delete, save and export.
2. HTML, CSS, JavaScript, JSON and plain text handling with language chips and highlighting.
3. Multiple tabs, active/dirty indicators, keyboard shortcuts and undo/redo.
4. Search/replace in the active file, select-all/copy/cut/paste controls.
5. Autosave recovery snapshot and explicit unsaved-change warning on page exit.
6. HTML/CSS/JS preview via `srcdoc` and refresh action.
7. Light/dark theme, font size, tab size, word wrap and autosave settings.
8. Android-sized responsive drawer layout with touch-sized controls.
9. Extension points documented for completion, terminal, Git, plugins, formatters and more languages.

## Honest constraints

This is a **functional web prototype/PWA foundation**, not yet a signed native Android APK/AAB. A native build requires Android SDK/Gradle or a phone/cloud build service, a stable signing key, app icon assets and Play Console account. The browser project itself is fully local and does not require a paid API.
