# Future Light — Android Preparation Handover

## ပြောင်းလဲထားသောအရာများ

Existing Future Light web editor/PWA ကို မဖျက်ဘဲ Capacitor `8.5.3` Android wrapper ထည့်ထားသည်။ `package.json` တွင် reproducible npm scripts ထည့်ထားပြီး `scripts/prepare-web.mjs` သည် root web source ကို Capacitor အတွက် `www/` ထဲ copy လုပ်သည်။ `capacitor.config.json` တွင် app ID ကို `com.futurelight.editor` နှင့် app name ကို `Future Light` အဖြစ် သတ်မှတ်ထားသည်။

`android/` project ကို generate/sync အောင်မြင်ပြီး Android launcher icon နှင့် splash resources များကို original Future Light SVG မှ generate လုပ်ထားသည်။ `ANDROID_BUILD.md` တွင် Termux/local build instructions နှင့် free GitHub Actions workflow ရှိသည်။ `.github/workflows/android-build.yml` သည် `npm ci`, source checks, missing `android/` ကို conditional `npx cap add android`, Capacitor sync နှင့် `assembleDebug` ပြီး APK artifact upload လုပ်ပေးမည်။

## Backup

Android ပြင်ဆင်မှုမစမီ မူလ source backup ကို `future-light-v1.0.0-pre-android.zip` အဖြစ် ထပ်သိမ်းထားသည်။ နောက်ဆုံး Android-ready project backup သည် `future-light-v1.0.0-capacitor.zip` ဖြစ်သည်။

## APK status

APK ကို လက်ရှိ sandbox တွင် **မထုတ်နိုင်သေးပါ**။ Capacitor generation နှင့် sync အောင်မြင်သော်လည်း debug build ကို စမ်းသပ်ချိန်တွင် ပထမဆုံး `javac` မရှိခြင်းကို တွေ့ရပြီး OpenJDK 21 JDK ကို install လုပ်ခဲ့သည်။ ထပ်မံ build လုပ်ရာတွင် Android SDK location မရှိခြင်း (`ANDROID_HOME`/`sdk.dir`) ကြောင့် ရပ်သွားသည်။ `android/app/build/outputs` ထဲတွင် verified APK file မရှိပါ။

## Single next action

**နောက်တစ်ဆင့်တစ်ခုတည်းမှာ** **Actions → Build Future Light Android debug APK → Run workflow** ကိုနှိပ်ရန် ဖြစ်သည်။ Workflow ပြီးလျှင် `future-light-debug-apk` artifact ကို download လုပ်ကာ Android ဖုန်းတွင် install စမ်းပါ။

GitHub မသုံးလိုပါက Android SDK/platform tools ပါသော Termux setup သို့မဟုတ် computer တစ်ခုတွင် `npm ci && npm run android:sync && npm run android:build:debug` ကို run ပါ။ Debug APK အောင်မြင်ပြီးမှ release signing key/AAB/Play Console အဆင့်များကို ဆက်လုပ်ရမည်။
