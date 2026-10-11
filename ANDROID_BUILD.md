# Future Light — Android APK Build Guide

## လက်ရှိအခြေအနေ

ဒီ project တွင် Capacitor Android wrapper configuration ထည့်ပြီးပါပြီ။ Application ID ကို `com.futurelight.editor` အဖြစ် တည်ငြိမ်စွာ ထိန်းထားသည်။ Web editor files များကို project root (`webDir: "."`) မှ Android WebView ထဲ bundle လုပ်မည်။

လက်ရှိ Manus sandbox တွင် Android SDK၊ `sdkmanager`၊ Gradle၊ `adb` နှင့် `javac` မရှိသောကြောင့် ဒီ environment ထဲမှ debug APK ကို မထုတ်နိုင်သေးပါ။ Wrapper project နှင့် free GitHub Actions workflow ကို ပြင်ဆင်ထားသဖြင့် အောက်ပါနည်းလမ်းနှစ်ခုထဲမှ တစ်ခုကို သုံးနိုင်သည်။

## အလွယ်ဆုံး free workflow — GitHub Actions

1. GitHub တွင် repository အသစ်တစ်ခု ဖန်တီးပါ။ Public repository သည် free Actions minutes အတွက် အလွယ်ဆုံးဖြစ်သည်။
2. ဒီ project ၏ source နှင့် `android/`, `capacitor.config.ts`, `package.json`, `.github/workflows/android-debug.yml` အပါအဝင် ဖိုင်အားလုံးကို repository သို့ upload/push လုပ်ပါ။
3. GitHub repository ထဲမှ **Actions → Build Android debug APK → Run workflow** ကို ရွေးပါ။
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

## Release AAB မထုတ်မီ

Debug APK သည် စမ်းသပ်ရန်သာ ဖြစ်သည်။ Google Play အတွက် release signing key ဖန်တီးပြီး password/key ကို source code ထဲ မထည့်ပါနှင့်။ `versionCode` ကို တိုးပြီး signed AAB ထုတ်ပါ။ ထို AAB ကို real Android phone များတွင် install/upgrade/data preservation/preview workflow စမ်းပြီးမှ Play Console သို့ upload လုပ်ပါ။

## Useful commands

```sh
npm run check
npm run android:sync
npm run android:build:debug
# Google Play release requires signing configuration:
npm run android:build:release
```

Native Android build အောင်မြင်ပြီး APK file ကို အမှန်တကယ် verify မလုပ်မချင်း APK ရှိသည်ဟု မသတ်မှတ်ရပါ။
