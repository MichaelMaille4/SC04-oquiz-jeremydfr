# Challenge SC01E04 - API 

Objectif : 
- avoir un environnement de travail fonctionnel (pour la semaine prochaine !)
- écrire une route d'API (pour réviser et découvrir Prisma)

## Mise en place de l'environnement

- Faire le [Gitflow](../../fiches/gitflow.md) pour mettre à jour son code puis créer une branche pour le challenge : 
  - `git checkout -b SC01E04-challenge-get-one-user`

- Supprimer sa BDD (histoire de repartir proprement)
  - `sudo -i -u postgres psql`
  - `DROP DATABASE oquiz;`
  - `DROP ROLE oquiz;`

- Suivre les étapes d'installation de l'API prévues dans [`INSTALL.md`](../../../INSTALL.md) pour : 
  - installer les dépendances
  - re-créer la BDD
  - lancer les migrations et l'échantillonnage
  - démarrer le serveur

- Penser à tester les routes existantes via le fichier `test/api.http`

## Exercice

- Ajouter la route `GET /api/users/:id` pour récupérer un utilisateur par son ID 
- La tester manuellement
- Commit / push
- Créer une `Pull Request` et demander éventuellement un retour aurpès du formateur


