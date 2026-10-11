# Android Wrapper Status

- Capacitor: `8.5.3`
- Android wrapper: **generated and synced** in `android/`
- Application ID: `com.futurelight.editor` (verified in `android/app/build.gradle`)
- Web directory: generated `www/` via `scripts/prepare-web.mjs`
- Original Future Light launcher icon: generated into Android mipmap resources with Capacitor Assets.
- Debug APK in current sandbox: **not generated**
- Build attempt 1 blocker: JDK compiler was missing; OpenJDK 21 JDK was installed.
- Build attempt 2 blocker: Android SDK location/platform is missing (`ANDROID_HOME`/`sdk.dir`).
- Prepared fallback: `ANDROID_BUILD.md` and `.github/workflows/android-build.yml` for a free GitHub Actions build.
