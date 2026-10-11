# Future Light — Mobile Code Bench

Future Light သည် ဖုန်းမျက်နှာပြင်သေးသေးပေါ်တွင် HTML, CSS, JavaScript, JSON နှင့် text ဖိုင်များကို ရေးသားရန် တည်ဆောက်ထားသော **local-first web editor/PWA foundation** ဖြစ်သည်။ Acode ၏ source code၊ branding သို့မဟုတ် assets များကို မကူးယူဘဲ မူရင်း Future Light identity ဖြင့် ရေးသားထားသည်။

## လက်ရှိ release

- **Version:** `1.0.0`
- **Future Android application ID:** `com.futurelight.editor`
- **Runtime:** HTML + CSS + JavaScript ES modules; third-party paid service မလိုပါ။
- **Data:** browser `localStorage` ထဲတွင် သိမ်းသည်။ Server/database မရှိသောကြောင့် offline အခြေခံ editing လုပ်နိုင်သည်။
- **Preview:** `index.html` ထဲသို့ `styles.css` နှင့် `script.js` ကို ထည့်ပေါင်းပြီး browser sandbox iframe ဖြင့် ပြသသည်။
- **Android wrapper:** Capacitor `8.5.3` project ကို `android/` တွင် ထည့်ထားပြီး application ID သည် `com.futurelight.editor` ဖြစ်သည်။

## ဘာတွေ အလုပ်လုပ်သလဲ

Explorer မှာ ဖိုင်နှင့် folder အသစ်ဖန်တီးခြင်း၊ file import၊ rename၊ delete၊ tab အများကြီးဖွင့်ခြင်းနှင့် Save/Backup/Import တို့ အလုပ်လုပ်သည်။ HTML, CSS, JavaScript, JSON, Markdown နှင့် plain text အတွက် lightweight syntax highlighting ရှိသည်။ Search/replace, replace all, undo/redo, select all, copy/cut, Tab indentation, line/column status နှင့် unsaved-change indicator ပါဝင်သည်။

Preview ခလုတ်သည် `index.html` ကို CSS/JS နှင့်အတူ render လုပ်ပေးသည်။ Dark/Light theme၊ font size၊ indent size၊ word wrap နှင့် autosave ကို Settings မှ ပြောင်းနိုင်သည်။ စာရိုက်ပြီးနောက် autosave အလုပ်လုပ်ပြီး recovery snapshot ကို သီးခြားသိမ်းထားသဖြင့် browser ပိတ်သွားပါက နောက်တစ်ကြိမ် ဖွင့်ချိန် restore prompt ပြသနိုင်သည်။

## Android ဖုန်းပေါ်တွင် စမ်းသပ်နည်း

1. Project ကို web server တစ်ခုတွင် run လုပ်ပြီး Chrome/Firefox ဖြင့် ဖွင့်ပါ။ Local computer မှ run လုပ်မည်ဆိုပါက project directory ထဲတွင် `python3 -m http.server 3000 --bind 0.0.0.0` ကို run လုပ်နိုင်သည်။
2. Android ဖုန်း browser မှ project URL ကို ဖွင့်ပါ။ Menu မှ **Add to Home screen / Install app** ကို ရွေးနိုင်သည်။
3. Explorer မှ `index.html` ကို ရွေးပြီး စာပြင်ပါ။ `Save` ကိုနှိပ်ပါ သို့မဟုတ် autosave ကို စောင့်ပါ။
4. Preview ကိုဖွင့်၍ ပြင်ဆင်ချက်ကို စစ်ပါ။ Backup ခလုတ်မှ JSON project backup ကို ဖုန်းထဲ download လုပ်ထားပါ။
5. ဖုန်းပြောင်းမည်ဆိုပါက Backup JSON ကို Import ဖြင့် ပြန်ထည့်ပါ။ Browser site data ကို မဖျက်မီ backup လုပ်ပါ။

> ဒီ release တွင် Android APK/AAB မပါသေးပါ။ Android SDK/Gradle နှင့် native build environment မရှိသည့် sandbox တွင် အတည်ပြုနိုင်သည့်အရာမှာ functional web prototype/PWA ဖြစ်သည်။

Android wrapper build အတွက် [ANDROID_BUILD.md](ANDROID_BUILD.md) ကိုဖတ်ပါ။ Capacitor web assets များကို `npm run android:prepare` ဖြင့် `www/` ထဲ generate လုပ်ပြီး `npm run android:sync` ဖြင့် Android assets ထဲ sync လုပ်သည်။

## Project ကို restore လုပ်နည်း

ZIP backup ကို ဖြည်ပြီး project root ကို web server ဖြင့် serve လုပ်ပါ။ Browser ထဲက Future Light ကိုဖွင့်ပါ။ `.json` project backup ရှိပါက Explorer ရှိ **Import** ခလုတ်ကိုနှိပ်ပြီး ဖိုင်ကိုရွေးပါ။ Browser localStorage ကို အပြီးဖျက်ထားလျှင် JSON backup သို့မဟုတ် ZIP source မှ ပြန်စနိုင်သည်။

## Future feature ထည့်နည်း

`js/storage.js` တွင် file model နှင့် local persistence ကို၊ `js/syntax.js` တွင် language highlighting ကို၊ `js/app.js` တွင် UI behavior ကို၊ `styles.css` တွင် visual tokens/responsive rules ကို ထည့်သွင်းပါ။ Existing functionality မပျက်စေရန် feature မထည့်မီ ZIP backup ပြုလုပ်ပါ။ ပြင်ပြီးနောက် `CHANGELOG.md` တွင် version/release note ထည့်ကာ `RELEASE_CHECKLIST.md` ကို ဖြည့်ပါ။

နောင်တွင် code completion/language server, formatter/error diagnostics, terminal bridge, Git adapter, plugin API, project templates, more languages နှင့် customizable keyboard shortcuts တို့ကို module အသစ်များအဖြစ် ထည့်နိုင်သည်။ အဆိုပါအရာများကို ယခု release တွင် completed ဟု မဆိုထားပါ။

## Native Android နှင့် Google Play လမ်းညွှန်

Native wrapper ပြုလုပ်ချိန်တွင် `com.futurelight.editor` ကို application ID အဖြစ် မပြောင်းဘဲ ထိန်းထားပါ။ Version အသစ်တိုင်းတွင် Android `versionCode` ကို တစ်ဆင့်တိုးပြီး user-visible `versionName` ကို ဥပမာ `1.0.1` အဖြစ် ပြောင်းပါ။ Release signing key ကို password manager/လုံခြုံသော offline backup နှစ်နေရာတွင် ထားပြီး public repository ထဲ မထည့်ပါနှင့်။

Google Play သို့ မတင်မီ signed AAB ကို real Android ဖုန်းများတွင် install, upgrade, data preservation, offline editing နှင့် preview workflows ဖြင့် စမ်းသပ်ပါ။ Play Console developer registration fee၊ target API၊ privacy policy၊ Data safety၊ app content၊ screenshots၊ age rating နှင့် review requirements များသည် အချိန်နှင့်အမျှ ပြောင်းနိုင်သဖြင့် Google Play Console ၏ လက်ရှိ official requirements ကို upload လုပ်မည့်နေ့တွင် စစ်ဆေးပါ။ ဤ project သည် ယခုအချိန်တွင် Play Store တွင် မထုတ်ဝေရသေးပါ။

## License / ownership note

ဤ project source သည် Future Light အတွက် မူရင်း implementation ဖြစ်သည်။ Third-party dependency မထည့်ထားပါ။ ထုတ်ဝေမည့် license ကို owner က release မတိုင်မီ ရွေးချယ်ပါ။
