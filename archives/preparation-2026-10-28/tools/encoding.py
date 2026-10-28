from pathlib import Path
r=Path('Dino-Dodo-update')
for f in ['src/app/app.component.html','src/app/app.component.ts','native/android/java/com/radioreveil/app/PlaybackService.java','scripts/setup-android.mjs']:
 s=(r/f).read_text(encoding='utf-8-sig')
 print(f, ascii(s[s.find('Dino-Dodo')-15:s.find('Dino-Dodo')+35]), 'corrupt', '\u00c3' in s, '\u00f0\u0178' in s)
 try:
  t=s.encode('cp1252').decode('utf8')
  print('repairable',ascii(t[t.find('Dino-Dodo')-15:t.find('Dino-Dodo')+35])); (r/f).write_text(t,encoding='utf8')
 except Exception as e: print(type(e).__name__)
