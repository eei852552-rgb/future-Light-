# Future Light — Release Checklist

## Before coding

- [ ] Project ZIP နှင့် working branch backup ပြုလုပ်ပါ။
- [ ] Existing app ID `com.futurelight.editor` ကို မပြောင်းကြောင်း စစ်ပါ။
- [ ] Requested feature/bug ကို issue သို့မဟုတ် changelog note အဖြစ် မှတ်တမ်းတင်ပါ။

## Development and testing

- [ ] Existing explorer, tabs, editor, save, recovery, search and preview workflows မပျက်ကြောင်း စမ်းပါ။
- [ ] New feature ကို light/dark theme နှင့် Android phone width တွင် စမ်းပါ။
- [ ] Browser console errors နှင့် build/lint/type diagnostics များကို စစ်ပြီး ပြင်ပါ။
- [ ] `CHANGELOG.md` တွင် release note ထည့်ပါ။

## Version and signing

- [ ] Android `versionCode` ကို တိုးပါ။
- [ ] Android `versionName` ကို ပြင်ပါ။
- [ ] Release signing key ကို လုံခြုံသော offline backup နှစ်နေရာတွင် သိမ်းပါ။
- [ ] Private key/password ကို source code၊ screenshot သို့မဟုတ် public repository ထဲ မထည့်ပါနှင့်။

## Build and Play

- [ ] Signed APK ဖြင့် local install test လုပ်ပါ။
- [ ] Signed AAB build output ကို checksum နှင့် သိမ်းပါ။
- [ ] Upgrade test တွင် user local/project data မပျက်ကြောင်း စစ်ပါ။
- [ ] Play Console ၏ လက်ရှိ target API၊ Data safety၊ app content၊ privacy policy၊ screenshots၊ age rating နှင့် review requirements ကို ဖြည့်ပါ။
- [ ] Review မတင်မီ exact package ID၊ versionCode နှင့် signing key ကို တစ်ကြိမ်ထပ်စစ်ပါ။
- [ ] Play Console သို့ AAB တင်ပြီး review/publish workflow ကို owner ကိုယ်တိုင် ပြီးစီးပါ။
