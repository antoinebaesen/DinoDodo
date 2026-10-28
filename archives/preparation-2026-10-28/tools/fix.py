from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'native/android/java/com/radioreveil/app/PlaybackService.java'
s=p.read_text(encoding='utf-8-sig').replace('private int position, duration;', 'private int position, duration, generation;')
s=s.replace('libraryUri = intent.getStringExtra(EXTRA_LIBRARY_URI);', 'persist(); release(); uri = null; title = null; position = 0; duration = 0;\n                libraryUri = intent.getStringExtra(EXTRA_LIBRARY_URI);')
s=s.replace('else if ("forward".equals(action) && ready) player.seekTo((int)Math.min((long)player.getCurrentPosition() + 60000, duration));', '''else if ("forward".equals(action)) {
                if (ready) player.seekTo((int)Math.min((long)player.getCurrentPosition() + 60000, duration));
                else if (player == null) { loadSaved(); if (uri != null) open(Uri.parse(uri), (int)Math.min((long)position + 60000, Math.max(0, duration - 1)), false); }
            }''')
s=s.replace('NotificationChannel channel =', 'if (Build.VERSION.SDK_INT >= 26) {\n        NotificationChannel channel =').replace('createNotificationChannel(channel);','createNotificationChannel(channel);\n        }')
s=s.replace('final String requestedLibrary = libraryUri;', 'final int request = ++generation;\n        final String requestedLibrary = libraryUri;').replace('if (active != this || !loading || player != previous)', 'if (active != this || generation != request || !loading || player != previous)').replace('if (active == this) fail', 'if (active == this && generation == request) fail')
s=s.replace('    private boolean requestFocus() {','''    private boolean requestFocus() {
        abandonFocus();
        if (Build.VERSION.SDK_INT < 26) {
            return audio.requestAudioFocus(legacyFocus, AudioManager.STREAM_ALARM, AudioManager.AUDIOFOCUS_GAIN) == AudioManager.AUDIOFOCUS_REQUEST_GRANTED;
        }''')
s=s.replace('    private void abandonFocus() { if (focus != null)', '''    private final AudioManager.OnAudioFocusChangeListener legacyFocus = change -> {
        if (change < 0 && ready) { player.pause(); persist(); update(); }
    };
    private void abandonFocus() { if (Build.VERSION.SDK_INT < 26 && audio != null) audio.abandonAudioFocus(legacyFocus); if (focus != null)''')
s=s.replace('private void release() { ready', 'private void release() { generation++; ready')
p.write_text(s,encoding='utf-8')
p=r/'src/app/app.component.html';s=p.read_text().replace('controlling || playback.loading || !playback.playing','controlling || playback.loading');p.write_text(s,encoding='utf-8')
for name in ['package.json','package-lock.json']:
 p=r/name;s=p.read_text().replace('"name": "radio-reveil"','"name": "dino-dodo"');p.write_text(s,encoding='utf-8')
# setup must install both the reusable native source and Android display names.
p=r/'scripts/setup-android.mjs';s=p.read_text().replace('copyFileSync }', 'copyFileSync, readFileSync, writeFileSync }');s=s.replace("console.log('[3/4]",'''const stringsPath = join(androidDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml');
let strings = readFileSync(stringsPath, 'utf8');
strings = strings.replace(/(<string name="(?:app_name|title_activity_main)">)[^<]*/g, '$1Dino-Dodo');
writeFileSync(stringsPath, strings);

console.log('[3/4]''');p.write_text(s,encoding='utf-8')
