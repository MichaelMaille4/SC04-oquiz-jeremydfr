# Dictionnaire de données

Objectif : **brouillon du MPD** avant implémentation réelle pour :

- préciser les types
- préciser les éventuelles contraintes
- exemplifier, clarifier les données manipulées

A ce stade, on choisi un SGBDR -> choisir les types correspondant

Plusieurs façon de le réaliser, en particulier, un tableau fait l'affaire

Ici, pour Oquiz, on choisit `PostgreSQL`

## Pour toutes les tables

- une colonne id GENERATED ALWAYS AS IDENTITY (int)
- une colonne created_at (timestamptz) avec par défaut le moment de l'insertion
- une colonne updated_at (timestamptz) avec par défaut le moment de l'insertion

## Table `user`

| Nom du champs | Type      | UNIQUE | NON NULL | PK  | FK  | Exemple           | Par défaut  | Description du champs               |
| ------------- | --------- | ------ | -------- | --- | --- | ----------------- | ----------- | ----------------------------------- |
| `id`          | `INTEGER` | ✅     | ✅       | ✅  |     | 1                 | `GENERATED` | L'identifiant de l'utilisateur      |
| `firstname`   | `TEXT`    | ❌     | ✅       | ❌  |     | "Alice"           |             | Prénom de l'utilisateur             |
| `lastname`    | `TEXT`    | ❌     | ✅       | ❌  |     | "Durand"          |             | Nom de l'utilisateur                |
| `email`       | `TEXT`    | ✅     | ✅       | ❌  |     | "alice@oclock.io" |             | Email de l'utilisateur              |
| `password`    | `TEXT`    | ❌     | ✅       | ❌  |     | "$2a$10$..."      |             | Mot de passe haché de l'utilisateur |
| `role`        | `ENUM`    | ❌     | ✅       | ❌  |     | "admin"           | "member"    | Role de l'utilisateur               |

- `ENUM` = 'member' | 'autor' | 'admin'

Si utilisation d'une table role
| `role_id` | `INTEGER` | ❌ | ✅ | ✅ | | "admin" | "member" | Role de l'utilisateur |

## 🧩 Table `quiz`

| Nom du champ   | Type       | UNIQUE | NON NULL | PK  | FK         | Exemple               | Par défaut  | Description du champ        |
| -------------- | ---------- | ------ | -------- | --- | ---------- | --------------------- | ----------- | --------------------------- |
| `id`           | `INTEGER`  | ✅     | ✅       | ✅  |            | 1                     | `GENERATED` | Identifiant unique du quiz  |
| `title`        | `TEXT`     | ❌     | ✅       | ❌  |            | "Quiz JavaScript"     |             | Titre du quiz               |
| `description`  | `TEXT`     | ❌     | ❌       | ❌  |            | "Testez vos bases JS" |             | Description du quiz         |
| `published_at` | `DATETIME` | ❌     | ❌       | ❌  |            | "2025-02-20 10:00"    |             | Date de publication du quiz |
| `author_id`    | `INTEGER`  | ❌     | ✅       | ❌  | ✅ user.id | 1                     |             | Auteur du quiz              |

## 🧩 Table `question`

| Nom du champ  | Type      | UNIQUE | NON NULL | PK  | FK          | Exemple                           | Par défaut  | Description du champ              |
| ------------- | --------- | ------ | -------- | --- | ----------- | --------------------------------- | ----------- | --------------------------------- |
| `id`          | `INTEGER` | ✅     | ✅       | ✅  |             | 10                                | `GENERATED` | Identifiant unique de la question |
| `statment.  ` | `TEXT`    | ❌     | ✅       | ❌  |             | "Comment déclarer une variable ?" |             | Texte de la question              |
| `anecdote`    | `TEXT`    | ❌     | ❌       | ❌  |             | "JS est né en 10 jours !"         |             | Anecdote liée à la question       |
| `link`        | `TEXT`    | ❌     | ❌       | ❌  |             | "wikipedia.org/wiki/JavaScript"   |             | Lien d’information complémentaire |
| `quiz_id`     | `INTEGER` | ❌     | ✅       | ❌  | ✅ quiz.id  |                                   |             | Référence à `quiz.id`             |
| `level_id`    | `INTEGER` | ❌     | ✅       | ❌  | ✅ level.id |                                   |             | Référence à `level.id`            |

## 🧩 Table `answer`

| Nom du champ  | Type      | UNIQUE | NON NULL | PK  | FK             | Exemple | Par défaut  | Description du champ               |
| ------------- | --------- | ------ | -------- | --- | -------------- | ------- | ----------- | ---------------------------------- |
| `id`          | `INTEGER` | ✅     | ✅       | ✅  |                | 50      | `GENERATED` | Identifiant unique du choix        |
| `description` | `TEXT`    | ❌     | ✅       | ❌  |                | `"let"` |             | Proposition de réponse             |
| `is_valid`    | `BOOLEAN` | ❌     | ✅       | ❌  |                | `true`  | `false`     | Indique si la réponse est correcte |
| `question_id` | `INTEGER` | ❌     | ✅       | ❌  | ✅ question.id | 10      |             | Référence à `question.id`          |

## 🧩 Table `tag`

| Nom du champ | Type      | UNIQUE | NON NULL | PK  | FK  | Exemple      | Par défaut  | Description du champ                 |
| ------------ | --------- | ------ | -------- | --- | --- | ------------ | ----------- | ------------------------------------ |
| `id`         | `INTEGER` | ✅     | ✅       | ✅  |     | 1            | `GENERATED` | Identifiant unique du tag            |
| `name`       | `TEXT`    | ✅     | ✅       | ❌  |     | "JavaScript" |             | Nom du tag                           |
| `parent_id`  | `INTEGER` | ❌     | ❌       | ❌  | ✅  | 5            |             | Référence à un tag parent (`tag.id`) |

## 🧩 Table `level`

| Nom du champ | Type      | UNIQUE | NON NULL | PK  | FK  | Exemple    | Par défaut  | Description du champ        |
| ------------ | --------- | ------ | -------- | --- | --- | ---------- | ----------- | --------------------------- |
| `id`         | `INTEGER` | ✅     | ✅       | ✅  |     | 1          | `GENERATED` | Identifiant du niveau       |
| `name`       | `TEXT`    | ✅     | ✅       | ❌  |     | "Débutant" |             | Nom du niveau de difficulté |

## 🧩 Table `quiz_has_tag`

| Nom du champ | Type      | UNIQUE | NON NULL | PK  | FK  | Exemple | Par défaut  | Description du champ         |
| ------------ | --------- | ------ | -------- | --- | --- | ------- | ----------- | ---------------------------- |
| `id`         | `INTEGER` | ✅     | ✅       | ✅  |     | 1       | `GENERATED` | Identifiant de l'association |
| `quiz_id`    | `INTEGER` | ❌     | ✅       |     | ✅  | 1       |             | Référence à `quiz.id`        |
| `tag_id`     | `INTEGER` | ❌     | ✅       |     | ✅  | 3       |             | Référence à `tag.id`         |

## 🧩 Table `attempt`

| Nom du champ | Type          | UNIQUE | NON NULL | PK  | FK  | Exemple            | Par défaut          | Description du champ           |
| ------------ | ------------- | ------ | -------- | --- | --- | ------------------ | ------------------- | ------------------------------ |
| `id`         | `INTEGER`     | ✅     | ✅       | ✅  |     | 100                | `GENERATED`         | Identifiant de la tentative    |
| `user_id`    | `INTEGER`     | ❌     | ✅       | ❌  | ✅  | 1                  |                     | Référence à `user.id`          |
| `quiz_id`    | `INTEGER`     | ❌     | ✅       | ❌  | ✅  | 5                  |                     | Référence à `quiz.id`          |
| `score_max`  | `INTEGER`     | ❌     | ✅       | ❌  |     | 10                 |                     | Score maximum possible du quiz |
| `score`      | `INTEGER`     | ❌     | ✅       | ❌  |     | 7                  |                     | Score obtenu par l’utilisateur |
| `date`       | `TIMESTAMPTZ` | ❌     | ✅       | ❌  |     | "2025-02-18 09:45" | `CURRENT_TIMESTAMP` | Date de la tentative           |
