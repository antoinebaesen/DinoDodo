from pathlib import Path
r=Path('Dino-Dodo-update')
p=r/'native/android/java/com/radioreveil/app/PlaybackService.java';s=p.read_text();s=s.replace('stopForeground(STOP_FOREGROUND_REMOVE); stopSelf(); }\n            persist(); update();','stopForeground(STOP_FOREGROUND_REMOVE); stopSelf(); return START_NOT_STICKY; }\n            persist(); update();');p.write_text(s,encoding='utf-8')
s=Path('C:/Users/baese/Documents/DinoTools/Dino Dodo/README.md').read_text(encoding='utf-8-sig').replace('Radio Réveil','Dino-Dodo')
s+='''

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
'''
(r/'README.md').write_text(s,encoding='utf-8')
