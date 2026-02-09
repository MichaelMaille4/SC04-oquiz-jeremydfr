# Clarification du besoin

## Idée d'outils de gestion de projet

- La BDD ==> SC01E03
  - que faut il stocker ? -> Modéliser les données (MERISE)
  - choix de la BDD

- L'interface utilisateur ==> SC01E02
  - Figma/TlDraw/Excalidraw/Papier-crayon
  - Zoning / Wireframe / Mockup / Prototype

- Triptyque Cout-Qualité-Délai ==> SC01E01
  - TJM ($$$)
  - Deadline

- Réfléchir au besoin utilisateur ==> SC01E01
  - Comprendre le besoin client
  - User stories : en tant que... je veux... afin de...
  - UI/UX
  - BDD
  - Spécifications techniques :
    - API : définir précisement les endpoints (routes) dont on a besoin
    - Déploiement : définir précisement le type d'infrastructure pour la production

- Choix de la stack technique ==> SC01E01
  - quelle architecture ?
    - API + SPA ?
    - SSR = Server Side Rendering
    - Hybride ?
    - Solution pré-existante (SaaS)
    - Solution CMS

- Organisations ==> SC01E02
  - Agiles (scrum)
  - ≠ Cycle en V
  - Kanban (Répartition)
  - Sprint
  - Roadmap
  - Backlog (Liste des tâches)

- Communiquer avec le client ==> SC01E01
  - README
  - Cahier des charges
  - Schéma produits (UI/UX + BDD)
  - UML : Unified Modeling Language

## Questions ouvertes

- Q. **Qu'est-ce qui vous amène à lancer cette application maintenant ?**
  - création d'une école, besoin d'une application de quiz, l'existant ne me convient pas

- Q. **Ordre de grandeur des données (nb de quizz, de question, de visiteurs simultanés)**
  - -> performance -> modélisation -> choix de la BDD
  - -> Simple : <3000 utilisateurs simultannés dans un premier temps

- Q. **A qui sont destinés ces quizz (etudiants, tout le monde) ?**
  - Majoritairement les étudiants de l'école à qui on donnerait les accès
  - Mais n'importe quel utilisateur internet aurait potentiellement accès à la plateforme avec la possibilité de se créer un compte et jouer des quiz
  - Certains utilisateurs auront des droits d'édition afin par exemple de créer des nouveaux quizzes (des profs, des experts)
  - **Plateforme développée dans le contexte scolaire mais a destination grand publique (en particulier, les étudiants de l'école)**

- Q. **Est-ce-que le programme est ouvert (tout le monde peut créer des quizz) ?**
  - Seul les utilisateurs connectés avec des droits "d'auteur" peuvent créer des quizzes
  - Et également les administrateurs de la plateforme

- Q. **Faut-il un administrateur pour créer tout ça ?**
  - Administrateur principal : Jeff
  - Capable de donner des droits d'administration à d'autres utilisateurs
    - => prévoir une interface permettant à Jeff de choisir qui il passe auteur ou admin
  - Un administrateur a le droit de changer le rôle d'un autre utilisateur (sauf lui-même)
  - Le rôle de Jeff est le même que les autres administrateurs

- Q. **Est-ce qu'on sépare les utilisateurs "étudiants" et "lambdas" ?**
  - Non. Pas la peine (on pourrait cela dit)
  - A la limite, on retrouverait les étudiants de l'école via le mail qu'ils ont utilisé en s'inscrivant

- Q. **les moderateurs peuvent-ils créer eux même le compte d'une tierce personne ?**
  - Non, on s'embête pas. CF : Triangle d'or : qualité / coût / délais

- Q. **Un utilisateur peut-il reporter un mauvais quizz?**
  - Non. Même raison

- Q. **Ou un quizz a-t-il besoin d'une validation avant d'être disponible**
  - Non. Même raison
  - Très interessant à modéliser cela dit !

- Q. **Est-ce qu'il y a une limite de création de quiz ?**
  - Non. Il peut y avoir zéro quiz dans la plateforme jusqu'à une "infinité théorique"

- Q. **combien de temps un quizz restera dans la bdd ?**
  - Jusqu'à ce que son auteur ou un admin décide de le supprimer
  - A priori, advitam eternam

- Q. **Est-ce qu'on pré-inscrit nos élèves**
  - OUI => plus de travail
  - NON => on délègue aux élèves leur création de compte

- Q. **Qu'est-ce qu'on a dans un quiz ?**
  - titre
  - brève description
  - thèmes
  - ((difficulté ----> Jeff nous dit : NON !))
  - questions
    - difficulté
    - énoncé
    - propositions de réponses
      - UNE bonne réponse

Ex :

- Quiz de la tartiflette
  - thèmes : hiver, cuisine, fromage
  - description : êtes-vous incollable sur ce plat savoyard ?
  - questions:
    - **question 1** : comment couper les oignons
    - difficulté : facile
      - proposition 1 : en lamelle ✅
      - proposition 2 : en dé
      - proposition 3 : on ne coupe pas les oignosn
      - proposition 4 : la réponse D
    - **question 2** : quel fromage utiliser ?
    - ...

- Q. **Quel est la différence entre un thème et un sujet ?**
  - Jeff : on simplifie, c'est la même chose.
  - Proposition : un thème peut avoir 0 sous thème jusqu'à N sous thèmes. Un thème peut être le sous-thème d'un autre thème
  - ex :
    - DEV (thème racine)
      - FRONTEND
        - VueJS
        - Svelte
        - React
      - BACKEND
        - PHP
        - Node.js

- Q. **QCM (multiple) ou QCU (unique) ?**
  - QCU pour simplifier

- Q. **Est-ce qu'on stock le score**
  - vidéo : NON !
  - après négociation (but pédagogique) : on accepte de stocker le score d'un membre qui joue un quiz
    - score max atteignable
    - score obtenu
    - date

- Q. **le niveau de difficulté / thèmes, c'est sur les quizzes ou les questions ?**
  - une QUESTION a toujours un niveau de difficulté (facile, moyen, difficile, etc...)
  - un QUIZZES peut avoir 0 à N thèmes (cuisine, sport, astronomie)
  - un quiz n'a pas de niveau de difficulté (en revanche, il est composé de questions avec un potentiellement différents niveau de diff)

- Q. **qui peut créer/assigner les niveau de difficulté**
  - seul les admin peuvent créer des nouveaux niveau
  - chaque auteur, peut piocher parmi la liste des niveaux existants, celui qui correspond le mieux à la question

- Q. **Quelle architecture serait adaptée pour Oquiz** ?
  - Si on prévilégier du SEO (ex: les données des quizzes doivent être référencé par les moteurs de recherche)
    - ex : "Quiz de la tartiflette ?" --> O'quiz ! ✅
    - ==> SSR pour les pages des quizzes

  - Si on ne souhaite pas rendre accessible nos quizzes aux utilisateurs non connecté --> pas d'intérêt à les référencer sur les moteurs
    - ex : "Quiz de la tartiflette ?" --> Pas d'O'quiz puisque de toute facon la page est protégé pour les membres connectés
    - ==> On peut profiter du dynamisme
      - ex : la page de création d'un quiz (auteur)
        - Option 1 : successions de plusieurs pages pour créer quiz puis questions puis réponse...
        - Option 2 : un maxi formulaire où on renseigne tout d'un coup
        - Option 3 : une seule page mais avec des appels successifs en tâches de fond (asynchrone) pour modifier la BDD
          - Google FORM

==> Ici, on prévilégie l'approche **API / SPA** :

- pour des raisons pédagogique (pratique, on ne s'occupe pas de la vue pendant ces 3 semaines -> focus sur l'API)
- pour des raisons de dynamisme (certaines pages necessiteraient plusieurs appels API pour fonctionner de manière pratique)

==> Sinon, on pourrait utiliser un meta framework

- NextJS / NuxtJS / SvelteKit / ... pour profiter de certains composants générés côté serveur (et d'autres côté client)
