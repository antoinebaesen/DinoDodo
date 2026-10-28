# Dino-Dodo

Petit radio-réveil Android **100 % local** construit avec Angular + Ionic + Capacitor.

## Fonctionnalités incluses

- heure de réveil configurable ;
- activation / désactivation ;
- plusieurs bibliothèques audio ;
- les bibliothèques sont simplement les **sous-dossiers** d'un dossier racine choisi sur le téléphone ;
- choix de la bibliothèque du jour ;
- morceau choisi aléatoirement ;
- évite de rejouer immédiatement le morceau précédent quand plusieurs fichiers existent ;
- option **départ aléatoire dans le morceau** ;
- le départ aléatoire évite les 30 dernières secondes ;
- réveil exact même écran verrouillé / téléphone en veille ;
- reprogrammation automatique pour le lendemain ;
- reprogrammation après redémarrage du téléphone ;
- bouton Tester et bouton Arrêter ;
- aucune API, aucun compte, aucun backend, aucun Internet nécessaire pour l'usage.

## Organisation des fichiers sur le téléphone

Crée par exemple :

```text
Music/
└── RadioReveil/
    ├── OST/
    │   ├── nier.mp3
    │   ├── persona.flac
    │   └── zelda.ogg
    ├── Calme/
    │   ├── morceau-01.mp3
    │   └── morceau-02.mp3
    └── Energique/
        └── morceau-03.m4a
```

Dans l'application, choisis **RadioReveil** comme dossier racine. `OST`, `Calme` et `Energique` apparaîtront automatiquement comme bibliothèques.

Les sous-dossiers à l'intérieur d'une bibliothèque sont aussi parcourus.

Formats reconnus : MP3, M4A, AAC, OGG, OPUS, WAV et FLAC, ainsi que les fichiers dont Android expose un MIME type `audio/*`.

## Prérequis PC

- Node.js 22.12+ ;
- Android Studio récent ;
- SDK Android installé par Android Studio ;
- un téléphone Android ou un émulateur.

Capacitor 8 demande Node.js 22+ et cible Android API 24+.

## Installation la plus simple sous Windows

Double-clique :

```text
INSTALLER_ANDROID.bat
```

Il effectue :

1. `npm install`
2. création du projet Android Capacitor si nécessaire ;
3. copie du code natif ;
4. build Angular ;
5. synchronisation Capacitor ;
6. ouverture d'Android Studio.

Ensuite branche ton téléphone, active le débogage USB et clique sur **Run** dans Android Studio.

## Installation manuelle

```bash
npm install
npm run android:init
npm run android:open
```

Pour simplement tester l'interface dans le navigateur :

```bash
npm start
```

Le navigateur utilise trois bibliothèques de démonstration. L'accès aux vrais fichiers et le réveil sont uniquement disponibles sur Android.

## Utilisation

1. Ouvre l'application.
2. Appuie sur **Choisir un dossier**.
3. Sélectionne ton dossier `RadioReveil`.
4. Choisis une bibliothèque.
5. Choisis l'heure.
6. Active ou non **Départ aléatoire**.
7. Active le réveil.
8. Appuie sur **Enregistrer le réveil**.
9. Utilise **Tester** pour vérifier immédiatement la lecture.

## Fonctionnement Android

L'application ne reste pas continuellement active.

Quand tu enregistres le réveil, le code natif programme une alarme exacte avec `AlarmManager`. Au déclenchement, un `BroadcastReceiver` démarre brièvement `PlaybackService`, qui choisit un fichier local et le lit avec `MediaPlayer` en `USAGE_ALARM`.

Le service ne reste actif que pendant la lecture.

## Alarmes exactes

- Android 13+ : le manifest utilise `USE_EXACT_ALARM`, adapté à une vraie application de réveil.
- Android 12 / 12L : si Android refuse l'accès aux alarmes précises, l'application affiche un bouton **Autoriser** qui ouvre le réglage système correspondant.

## Limites à connaître

- Si l'utilisateur fait **Forcer l'arrêt** de l'application depuis les paramètres Android, Android annule ses alarmes jusqu'à ce que l'application soit relancée.
- Certains constructeurs ajoutent des optimisations batterie agressives. `AlarmManager` exact est la bonne API Android pour ce besoin, mais un constructeur peut malgré tout appliquer des restrictions particulières.
- Le volume utilisé est le **volume d'alarme** du téléphone, pas le volume média classique.
- Le mode Ne pas déranger reste soumis aux réglages d'alarmes choisis sur le téléphone.
- La V1 joue un seul morceau puis arrête le service lorsque le morceau se termine.

## Structure importante du projet

```text
src/app/
├── app.component.*            # interface
└── core/
    ├── models.ts
    ├── radio-alarm.plugin.ts  # pont TypeScript -> Android
    └── radio-alarm.service.ts

native/android/
├── AndroidManifest.xml
└── java/com/radioreveil/app/
    ├── MainActivity.java
    ├── RadioAlarmPlugin.java
    ├── AlarmPrefs.java
    ├── AlarmScheduler.java
    ├── AlarmReceiver.java
    ├── BootReceiver.java
    ├── PlaybackService.java
    └── StorageHelper.java
```

Le dossier `android/` lui-même est généré par Capacitor au premier `npm run android:init`. On garde notre code natif dans `native/android/` pour qu'il soit facile à relire et à réinstaller.

## Compatibilité Angular / Ionic

Le projet utilise volontairement **Angular 20.1.x + TypeScript 5.8.x** avec Ionic 8.
Cette combinaison évite le conflit de types `HTMLIonInputElement` / `autocorrect` rencontré avec TypeScript 5.9 et Angular 21.

Si tu avais déjà installé une ancienne version du projet basée sur Angular 21, lance `REPARER_DEPENDANCES.bat`.
Il supprime uniquement `node_modules` et `package-lock.json`, réinstalle les dépendances compatibles, rebuild le projet puis resynchronise Android.



## Lecteur Dino-Dodo

Le lecteur affiche le nom du fichier audio, sa bibliothèque et son avancement réel.
Pause/Reprendre conserve la position ; Suivant choisit un autre audio dans la même bibliothèque (si elle en contient plusieurs). +1 min avance de 60 secondes sans dépasser la fin. Depuis le début relance le même fichier.
Le dernier audio, sa bibliothèque, sa durée et sa position sont conservés toutes les secondes, en pause et à l’arrêt du service. Après fermeture de l’application ou redémarrage de la tablette, Reprendre recharge le fichier local mémorisé. Le dossier doit toujours être accessible. À la fin naturelle du fichier, la reprise repart du début.
Les boutons Pause/Reprendre, Suivant et Arrêter sont aussi présents dans la notification Android. La perte du focus audio met la lecture en pause.

## Sécurité dans l’application Horloge

Quand un réveil est enregistré et programmé, Dino-Dodo ouvre Horloge pour demander une alarme ponctuelle 15 minutes plus tard. Confirmer cette création dans Horloge. Le réveil principal reste quotidien ; la sécurité Horloge concerne uniquement la prochaine occurrence et doit être redemandée en enregistrant à nouveau le réveil les jours suivants.

Le bouton Désactiver la sécurité demande à Horloge d’annuler uniquement l’alarme identifiée par son libellé Dino-Dodo. Android ne fournit pas une confirmation fiable de création ou d’annulation : vérifier dans Horloge, puis utiliser « J’ai vérifié : elle est désactivée ». Désactiver le réveil principal ne supprime pas silencieusement la sécurité d’Horloge.

Pour éviter d’accumuler des alarmes, un changement d’heure demande de désactiver et confirmer l’ancienne sécurité avant d’en créer une nouvelle. Aucune autre alarme d’Horloge n’est ciblée.

L’interface Android standard ne permet pas de choisir une date pour une alarme ponctuelle. Si la sécurité tombe dans plus de 24 heures (cas d’un réveil proche de minuit), Dino-Dodo conserve le réveil principal mais signale que la sécurité n’a pas été créée ; la demander ultérieurement ou la configurer manuellement dans Horloge. Une application Horloge compatible doit être installée.

## Validation de cette mise à jour

Compilation Angular et compilation Android debug. Les commandes de l’interface sont vérifiées avec un pont Android simulé. La lecture réelle des fichiers, la reprise après redémarrage et les confirmations de l’application Horloge restent à vérifier sur la tablette cible.
