# Modèle Logique de données (MLD)

Etape de traduction du MCD : 
- conceptuel -> technique
- français -> anglais
- entité -> tables
- attributs -> champs/colonnes
- déterminant -> clé primaire (ou des champs unique)
- association -> clé étrangère et/ou tables de liaison

On prépare le terrain avant de faire le modèle physique (MPD)

Exercice moins normalisé : 
- schéma OK
- textuel OK

Consensus :
- on ne précise pas les types (raison : a ce stade, on n'a pas encore choisi le SGBDR)
  - TEXT (Postgres) ≠ STRING (mySQL)
  - à la limite, on le rédige en français pour dire qu'il s'agit d'une chaine de caractère, 

## Rgèles de traduction des associations

```
UTILISATEUR ---- 0,N ----- CREER ----- 1,1 ----- QUIZ
              
              max(0,N)              max(1,1)
              = N                   = 1

==> 1-N
==> One-To-Many
```

- **One-To-One** :
  - il _suffit_ d'ajouter un champ scalaire (string, number, bool) d'un côté de l'association
  - rare comme type d'association
- **One-To-Many** : 
  - il _suffit_ d'ajouter une clé étrangère sur une des tables (proche du 1) qui pointe vers la clé primaire de l'autre table
- **Many-To-Many** : 
  - il _suffit_ d'ajouter une table de liaison avec deux clés étrangères qui pointent vers les clés primaires de part et d'autres


## Version textuelle

- **Etape 1** : traduire les tables
- **Etape 2** : traduire les attributs + ID par table
- **Etape 3** : traduire les associations

`#FK` = `Foreign Key`

```
user (
  id             #PK
  firstname
  lastname
  email
  password
  role
  created_at
  updated_at
)

quiz (
  id             #PK
  title
  description
  published_at 
  author_id      #FK -> user.id
)

question (
  id             #PK
  description
  anecdote
  wiki_link
  quiz_id        #FK->quiz.id
  level_id       #FK->level.id
)

choice (
  id             #PK
  description
  is_valid
  question_id    #FK->question.id
)

tag (
  id             #PK
  nom
  parent_id      #FK->tag.id
)

level (
  id             #PK
  nom
)

quiz_has_tag (
  quiz_id        #FK->quiz.id     #PK (clé primaire composite)
  tag_id         #FK->tag.id      #PK (clé primaire composite)
)

attempt (
  id             #PK
  user_id
  quiz_id
  score_max
  score
  date
)
```

**Clé primaire composite** :
- il n'est pas possible d'avoir deux fois le même tag sur un même quiz -> c'est ce que veut Jeff !
- => unicité du couple quiz/tag
- 

```sql
CREATE TABLE "quiz_has_tag" (
  quiz_id INT NOT NULL REFERENCES quiz.id,
  tag_id INT NOT NULL REFERENCES tag.id,
  PRIMARY KEY (quiz_id, tag_id)
);

INSERT quiz_has_tag 
  (quiz_id, tag_id) 
VALUES
  (1, 4),
  (1, 7),
  (2, 8),
  (2, 4),
  (1, 4) <-- ❌ interdit
;
```


### Tag enfants / tag parent

```sql
-- Si on veut tous les TAGS ENFANTS
SELECT * FROM "tag" WHERE parent_id IS NOT NULL;

-- Si on veut tous les TAGS PARENT
SELECT DISTINCT parent.* FROM "tag" AS parent JOIN "tag" AS child ON child.parent_id = parent.id;

-- Si on veut tous les TAGS RACINE (sans parent)
SELECT * FROM "tag" WHERE parent_id IS NULL;
```

```sql
INSERT INTO "tag" 
  ("id", "name", "parent_id")
VALUES 
  (1, 'Web dev', null),
  (2, 'Frontend', 1),
  (3, 'Backend', 1),
  (4, 'Svelte', 2),
  (5, 'React', 2)
```

## MLD (Schéma)


