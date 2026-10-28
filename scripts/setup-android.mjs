import { existsSync, mkdirSync, cpSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const androidDir = join(root, 'android');
const nativeDir = join(root, 'native', 'android');
const javaTarget = join(androidDir, 'app', 'src', 'main', 'java', 'com', 'radioreveil', 'app');
const manifestTarget = join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml');

function run(command) {
  execSync(command, { cwd: root, stdio: 'inherit', shell: true });
}

if (!existsSync(androidDir)) {
  console.log('\n[1/4] Création du projet Android Capacitor…');
  run('npx cap add android');
} else {
  console.log('\n[1/4] Le dossier android/ existe déjà, création ignorée.');
}

console.log('[2/4] Installation du code natif Dino-Dodo…');
mkdirSync(javaTarget, { recursive: true });
cpSync(join(nativeDir, 'java', 'com', 'radioreveil', 'app'), javaTarget, {
  recursive: true,
  force: true,
});
copyFileSync(join(nativeDir, 'AndroidManifest.xml'), manifestTarget);

const stringsPath = join(androidDir, 'app', 'src', 'main', 'res', 'values', 'strings.xml');
let strings = readFileSync(stringsPath, 'utf8');
strings = strings.replace(/(<string name="(?:app_name|title_activity_main)">)[^<]*/g, '$1Dino-Dodo');
writeFileSync(stringsPath, strings);

console.log('[3/4] Build Angular…');
run('npm run build');

console.log('[4/4] Synchronisation Capacitor…');
run('npx cap sync android');

console.log('\n✓ Android est prêt. Lance : npm run android:open');
