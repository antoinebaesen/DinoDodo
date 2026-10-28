# 🦕 Dino-Dodo

**Dino-Dodo est un réveil audio pour téléphone et tablette Android.** Il permet de se réveiller avec ses propres fichiers, de choisir une ambiance parmi plusieurs bibliothèques et de reprendre le dernier audio à l’endroit où il a été interrompu.

L’application fonctionne avec les fichiers présents sur l’appareil, sans compte ni connexion Internet pour son usage courant. Son interface aux couleurs pastel rassemble la programmation du réveil et les commandes de lecture.

## Présentation et usages

### Se réveiller avec ses propres ambiances

Regroupe tes musiques, bandes originales ou autres contenus audio dans des sous-dossiers : chacun devient une bibliothèque. Choisis celle que tu souhaites écouter au réveil, puis règle l’heure.

Le réveil principal est **quotidien**. À son déclenchement, Dino-Dodo choisit un fichier dans la bibliothèque sélectionnée et évite de reprendre immédiatement le précédent lorsque plusieurs fichiers sont disponibles. L’option **Départ aléatoire** permet de commencer à un autre endroit du morceau, en évitant ses 30 dernières secondes.

### Continuer à écouter avec le lecteur intégré

Le lecteur affiche le titre du fichier, sa bibliothèque, sa durée et son avancement. Il propose les commandes suivantes :

| Commande | Usage |
| --- | --- |
| Pause / Reprendre | Interrompre et poursuivre le même audio |
| Suivant | Choisir un autre audio dans la même bibliothèque, si elle en contient plusieurs |
| +1 min | Avancer d’une minute, sans dépasser la fin du fichier |
| Depuis le début | Relancer le même audio au début |
| Arrêter | Couper la lecture en conservant sa position |

Le dernier audio et sa position sont mémorisés pour pouvoir le reprendre après fermeture de l’application. Le fichier doit rester présent et son dossier accessible. À la fin naturelle du fichier, la position revient au début ; le passage à un autre audio se fait avec **Suivant**.

Les commandes Pause/Reprendre, Suivant et Arrêter sont aussi disponibles dans la notification Android.

### Ajouter une sécurité dans Horloge

Quand tu enregistres un réveil actif, Dino-Dodo demande à l’application **Horloge** de créer une alarme ponctuelle **15 minutes après le réveil principal**. Par exemple, un réveil à 8 h entraîne une demande de sécurité à 8 h 15.

**Confirme la création dans Horloge.** La sécurité concerne uniquement la prochaine occurrence : pour les jours suivants, il faut la redemander en enregistrant de nouveau le réveil. Le réveil principal reste quotidien.

Le bouton **Désactiver la sécurité** demande son annulation dans Horloge. Vérifie le résultat dans Horloge, puis utilise **J’ai vérifié : elle est désactivée**. Désactiver le réveil principal ne désactive pas automatiquement cette alarme séparée.

## Utilisation

### Préparer les fichiers audio

Crée sur ton appareil un dossier organisé, par exemple :

```text
Dino-Dodo/
├── Calme/
│   ├── pluie.mp3
│   └── piano.flac
├── OST/
│   ├── aventure.ogg
│   └── exploration.m4a
└── Énergique/
    └── matin.mp3
```

Dans l’application, sélectionne **Dino-Dodo** comme dossier racine. Les dossiers `Calme`, `OST` et `Énergique` apparaîtront comme bibliothèques. Les sous-dossiers qu’ils contiennent sont également parcourus.

Formats reconnus : **MP3, M4A, AAC, OGG, OPUS, WAV et FLAC**, ainsi que les fichiers identifiés par Android comme audio. La lecture dépend des formats et codecs pris en charge par l’appareil.

### Programmer le réveil

1. Ouvre Dino-Dodo et appuie sur **Choisir un dossier**.
2. Sélectionne ton dossier racine et accorde l’accès demandé par Android.
3. Choisis une bibliothèque et utilise **Tester** pour vérifier la lecture.
4. Active le réveil, règle l’heure et choisis si tu veux un départ aléatoire.
5. Appuie sur **Enregistrer le réveil**.
6. Si Android le demande, autorise les alarmes précises et enregistre à nouveau le réveil.
7. Dans Horloge, confirme la création de l’alarme de sécurité à +15 minutes.

Le lecteur permet ensuite de mettre en pause, reprendre ou changer l’audio. **Arrêter** coupe la lecture ; pour désactiver les prochains réveils, désactive l’interrupteur du réveil et enregistre.

### Points à connaître

- La lecture utilise le **volume d’alarme** de l’appareil. Vérifie aussi les réglages du mode Ne pas déranger.
- Le réveil peut être déclenché écran éteint ; il ne rallume pas un appareil complètement éteint.
- Un **Forcer l’arrêt** depuis les paramètres Android empêche le déclenchement jusqu’à la relance de l’application. Relance-la et enregistre de nouveau le réveil.
- Les restrictions de batterie de certains appareils peuvent affecter les alarmes : vérifie le fonctionnement sur l’appareil utilisé.
- Lors d’un changement d’heure, désactive et confirme l’ancienne sécurité dans Horloge avant d’en demander une nouvelle si elle peut encore être active.

## Installation

### Installer l’APK sur Android

Un APK de test est disponible à la racine du projet : **[Dino-Dodo.apk](Dino-Dodo.apk)**.

1. Transfère l’APK sur le téléphone ou la tablette.
2. Ouvre-le depuis le gestionnaire de fichiers.
3. Si nécessaire, autorise cette source à installer des applications, puis termine l’installation.
4. Lance Dino-Dodo et configure ton dossier audio et ton réveil.

L’application vise **Android 7.0 ou version ultérieure**. Une application Horloge compatible est nécessaire pour la sécurité à +15 minutes. L’APK fourni est une compilation de test signée avec la clé de développement.

### Installer depuis les sources

Prérequis sur le PC :

- **Node.js 22.12 ou version ultérieure** et npm ;
- **Android Studio**, avec le SDK Android requis par le projet ;
- un **JDK 21** pour la compilation Android ;
- un appareil Android avec débogage USB activé, ou un émulateur.

Sous Windows, ouvre **`INSTALLER_ANDROID.bat`** à la racine du projet. Il installe les dépendances, prépare les sources Android, compile l’interface et ouvre Android Studio. Sélectionne ensuite l’appareil cible et lance l’application avec **Run**.

Pour effectuer ces étapes manuellement, depuis la racine du projet :

```powershell
npm install
npm run android:init
npx cap open android
```

Pour produire un APK de test sous Windows, après configuration du JDK et du SDK :

```powershell
npm run android:init
.\android\gradlew.bat -p android assembleDebug
```

Le fichier généré se trouve dans `android/app/build/outputs/apk/debug/app-debug.apk`. `Dino-Dodo.apk` à la racine est une copie de distribution à actualiser après une nouvelle compilation.

### Afficher l’aperçu dans le navigateur

```powershell
npm install
npm start
```

Ouvre l’adresse affichée par le serveur de développement. Cet aperçu utilise des bibliothèques de démonstration ; la lecture native, l’accès aux vrais dossiers et les alarmes nécessitent Android.

## Partie technique

### Technologies et structure

L’interface utilise **Angular 20.1, Ionic 8 et TypeScript 5.8**. **Capacitor 8** relie cette interface au code Android natif écrit en Java.

| Emplacement | Rôle |
| --- | --- |
| `src/app/app.component.*` | Interface du réveil et du lecteur |
| `src/app/core/models.ts` | Modèles de configuration et d’état |
| `src/app/core/radio-alarm.service.ts` | Accès aux fonctions natives et mode aperçu web |
| `src/app/core/radio-alarm.plugin.ts` | Contrat du pont TypeScript vers Android |
| `native/android/` | Sources Android de référence et manifeste |
| `android/` | Projet Android utilisé pour compiler l’application |
| `www/` | Interface compilée et synchronisée avec Android |
| `scripts/setup-android.mjs` | Installation du code natif, compilation web et synchronisation |
| `archives/` | Sauvegardes et anciens fichiers de préparation, hors sources actives |

Le dossier du projet est son unique dossier de travail. Modifier le code Android de référence dans **`native/android/`**, puis lancer **`npm run android:init`** : ce script le recopie dans `android/`. Une modification effectuée uniquement dans la copie Android peut être écrasée à la préparation suivante.

### Fonctionnement du réveil et du lecteur

- **`AlarmPrefs`** conserve la configuration et les informations du dossier sélectionné.
- **`AlarmScheduler`** programme le réveil avec `AlarmManager`, via une alarme exacte autorisée pendant la veille.
- **`AlarmReceiver`** démarre le service de lecture et reprogramme le réveil du lendemain.
- **`BootReceiver`** reprogramme le réveil après redémarrage de l’appareil ou remplacement de l’application.
- **`StorageHelper`** parcourt les bibliothèques accessibles via les autorisations de dossier Android.
- **`PlaybackService`** utilise `MediaPlayer` avec l’usage audio `USAGE_ALARM`, gère les commandes et affiche une notification de service au premier plan.

Le fichier, sa bibliothèque, sa durée et sa position sont conservés dans les préférences locales. La position est enregistrée environ chaque seconde, en pause et à l’arrêt du service. Une interruption brutale peut donc entraîner un léger décalage à la reprise. La perte du focus audio met la lecture en pause.

L’identifiant Android reste **`com.radioreveil.app`** ; le nom affiché est **Dino-Dodo**. Les noms internes `RadioAlarm` sont conservés dans le pont natif.

### Permissions et intégration Horloge

Le manifeste prévoit notamment les alarmes exactes, le démarrage après redémarrage, le service de lecture au premier plan et la permission de demander des alarmes à Horloge. Sur Android 12/12L, l’accès aux alarmes exactes peut nécessiter une autorisation dans les paramètres. À partir d’Android 13, le projet déclare `USE_EXACT_ALARM`.

La sécurité utilise **`AlarmClock.ACTION_SET_ALARM`** pour demander sa création et **`ACTION_DISMISS_ALARM`** pour demander son annulation à partir d’un libellé propre à Dino-Dodo. L’application conserve l’état de la demande, sans prétendre confirmer le résultat dans Horloge.

L’interface standard d’Horloge ne permet pas de choisir une date pour une alarme ponctuelle. Si la sécurité tombe à **24 heures ou plus dans le futur**, Dino-Dodo signale qu’elle n’a pas été créée. Le réveil principal reste enregistré ; la sécurité doit être demandée plus tard ou configurée manuellement dans Horloge.

### Commandes de développement

| Commande | Fonction |
| --- | --- |
| `npm start` | Lancer l’aperçu web |
| `npm run build` | Compiler l’interface dans `www/` |
| `npm run android:init` | Installer les sources natives, compiler et synchroniser Android |
| `npm run android:sync` | Compiler et synchroniser l’interface, sans recopier les sources natives |
| `npm run android:open` | Compiler et synchroniser l’interface, puis ouvrir Android Studio |
| `npm run android:run` | Compiler et synchroniser l’interface, puis lancer sur une cible Android |

Après une modification de `native/android/`, utiliser d’abord **`npm run android:init`**.

Le projet conserve Angular 20.1 et TypeScript 5.8 pour sa compatibilité avec Ionic 8. `REPARER_DEPENDANCES.bat` est réservé à la réparation d’une ancienne installation incompatible : il supprime `node_modules` et `package-lock.json`, puis réinstalle les dépendances et prépare Android.

### Vérifications réalisées

La mise à jour a passé la compilation Angular et la compilation Android debug. Les commandes de l’interface ont été vérifiées avec un pont Android simulé, sur des dimensions de téléphone et de tablette.

La lecture réelle des fichiers, la reprise après redémarrage et les échanges avec Horloge doivent encore être vérifiés sur l’appareil cible.

## Transparence sur la réalisation

Ce projet a été réalisé avec l’aide de **Codex, l’assistant de développement d’OpenAI**, pour la rédaction et la modification du code, la documentation et certaines vérifications. Les fonctionnalités ont été définies et orientées par le porteur du projet. L’assistance de Codex ne remplace pas les essais sur les appareils Android utilisés.
