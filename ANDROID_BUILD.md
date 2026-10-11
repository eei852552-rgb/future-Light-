# Future Light — Android APK Build Guide

## လက်ရှိအခြေအနေ

ဒီ project တွင် Capacitor Android wrapper configuration ထည့်ပြီးပါပြီ။ Application ID ကို `com.futurelight.editor` အဖြစ် တည်ငြိမ်စွာ ထိန်းထားသည်။ `scripts/prepare-web.mjs` က HTML/CSS/JavaScript web app ကို `www/` ထဲပြင်ဆင်ပြီး Android WebView ထဲ bundle လုပ်မည်။

လက်ရှိ Manus sandbox တွင် Android SDK၊ `sdkmanager`၊ Gradle၊ `adb` နှင့် `javac` မရှိသောကြောင့် ဒီ environment ထဲမှ debug APK ကို မထုတ်နိုင်သေးပါ။ Wrapper project နှင့် free GitHub Actions workflow ကို ပြင်ဆင်ထားသဖြင့် အောက်ပါနည်းလမ်းနှစ်ခုထဲမှ တစ်ခုကို သုံးနိုင်သည်။

## အလွယ်ဆုံး free workflow — GitHub Actions

1. GitHub တွင် repository အသစ်တစ်ခု ဖန်တီးပါ။ Public repository သည် free Actions minutes အတွက် အလွယ်ဆုံးဖြစ်သည်။
2. Repository ထဲတွင် `package.json`, `package-lock.json`, `capacitor.config.json`, `scripts/`, `js/`, `public/` နှင့် `.github/workflows/android-build.yml` ရှိရမည်။ `android/` မရှိလျှင် workflow က `npx cap add android` ဖြင့် အလိုအလျောက် generate လုပ်မည်။
3. GitHub repository ထဲမှ **Actions → Build Future Light Android debug APK → Run workflow** ကို ရွေးပါ။
4. Workflow ပြီးလျှင် run page ၏ **Artifacts** အောက်မှ `future-light-debug-apk` ကို download လုပ်ပါ။
5. ZIP ဖြည်ပြီး APK ကို Android phone တွင် install လုပ်ပါ။ Android settings တွင် ဒီ source အတွက် “Install unknown apps” ကို ခွင့်ပြုရန် လိုနိုင်သည်။

GitHub Actions မှာ payment မလိုဘဲ public repository အတွက် အသုံးပြုနိုင်သည်။ Repository ကို private ထားမည်ဆိုလျှင် GitHub ၏ လက်ရှိ free minutes/limits ကို upload မလုပ်မီ စစ်ပါ။

## Local/Termux workflow (ဖုန်းပေါ်မှာ လုပ်လိုပါက)

Termux နှင့် storage လုံလောက်သော Android phone လိုအပ်ပါသည်။ Android SDK နှင့် Gradle သည် ကြီးမားသော download ဖြစ်သောကြောင့် Wi‑Fi နှင့် အနည်းဆုံး several GB free space ပြင်ဆင်ပါ။

```sh
pkg update
pkg install git nodejs openjdk-21
cd ~/future-light
npm ci
npm run check
npm run android:sync
npm run android:build:debug
```

အောင်မြင်ပါက APK ကို `android/app/build/outputs/apk/debug/app-debug.apk` တွင် ရှာပါ။ Termux တွင် Android SDK မရှိပါက `ANDROID_HOME`/`ANDROID_SDK_ROOT` ကို Android command-line tools တည်နေရာသို့ သတ်မှတ်ပြီး `platform-tools`, လိုအပ်သော `platforms;android-35` နှင့် build-tools ကို ထည့်ရမည်။ SDK package versions သည် Capacitor/Android Gradle Plugin အလိုက် ပြောင်းနိုင်သဖြင့် build error ထွက်ပါက error message အတိုင်း platform/build-tools version ကို သတ်မှတ်ပါ။

## Google Play အတွက် Release AAB

Debug APK သည် စမ်းသပ်ရန်သာ ဖြစ်သည်။ Google Play အတွက် release signing key ကို computer သို့မဟုတ် လုံခြုံသော password manager ထဲတွင် ဖန်တီးပြီး password/key ကို GitHub ထဲ မထည့်ပါနှင့်။ `android/app/build.gradle` တွင် `versionCode` ကို တိုးပြီး signing configuration ကို local `keystore.properties` သို့မဟုတ် GitHub Actions Secrets ဖြင့် ထည့်ပါ။ ထို့နောက် `npm ci && npm run android:sync && npm run android:build:release` ကို run လုပ်ပါ။ အောင်မြင်ပါက AAB သည် `android/app/build/outputs/bundle/release/app-release.aab` တွင် ရှိမည်။ AAB ကို real Android phone များတွင် install/upgrade/data preservation/preview workflow စမ်းပြီးမှ Play Console သို့ upload လုပ်ပါ။

### Phone မှ APK download/install

GitHub Actions run ပြီးလျှင် run page အောက်မှ **Artifacts → future-light-debug-apk** ကိုနှိပ်ပြီး ZIP ကို download လုပ်ပါ။ ZIP ဖြည်ပြီး `app-debug.apk` ကိုနှိပ်ပါ။ Android က တားပါက **Settings → Install unknown apps → သင်အသုံးပြုသော browser/Files → Allow** ကို ခဏဖွင့်ပြီး install လုပ်ပါ။ Install ပြီးလျှင် ထို permission ကို ပြန်ပိတ်နိုင်သည်။

## Useful commands

```sh
npm run check
npm run android:sync
npm run android:build:debug
# Google Play release requires signing configuration:
npm run android:build:release
```

Native Android build အောင်မြင်ပြီး APK file ကို အမှန်တကယ် verify မလုပ်မချင်း APK ရှိသည်ဟု မသတ်မှတ်ရပါ။
