# Challenge SC01E03 - Modéliser YouTube (MERISE)

## Rappel : Git Flow

Penser à mettre à jour votre dépôt à l'aide du [Git Flow](../../fiches/gitflow.md), et à créer une **branche dédiée pour réaliser le challenge** : 
- `git checkout -b SC01E03-challenge-modelisation-bdd`

## Objectif

On veut _tout simplement_ (😇) créer un **clone de YouTube**. 

## Analyse des fonctionnalités

Se rendre sur YouTube pour faire un repérage des différentes fonctionnalités. On se limite à celles de base : vidéos, playlists, commentaires, tags, utilisateurs, recherche...

## Conception

On organise sa conception à l'aide de la méthode MERISE :

- Réaliser le **MCD**
  - utiliser `Draw.io` ou `MoCoDo`

- Réaliser le **MLD**
  - format `textuel` ou `schématique`

- Réaliser le **MPD**
  - format `SQL` 
  - une partie des tables suffira largement si vous manquez de temps
  - penser à tester votre script dans une BDD Postgres

- (optionel) **Dictionnaire de données**
  - format `tableau`

----

**Rappel :** une modélisation est **une** représentation de la réalité : il y a souvent plusieurs solutions pour répondre à la même problématique ! Autrement dit, si votre solution diffère de la correction, elle n'est pas nécessairement fausse pour autant. En revanche, elle peut être maladroite, ou poser des problèmes (non repérée à la conceptions) au moment de l'implémentation.


**Rappel :**
- Le plus difficile, c'est le MCD
- Le MLD c'est la traduction directe de ce MCD
- Le dictionnaire de données peut-être généré automatiquement par un LLM à partir du MLD
- Le script SQL peut être généré automatiquement par un LLM à partir du dictionnaire
