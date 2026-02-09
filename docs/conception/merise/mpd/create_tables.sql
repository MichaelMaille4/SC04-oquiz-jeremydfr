BEGIN;

-- Supprimer les tables avant de les re-créer (dans le bon ordre à cause des clés étrangères)
DROP TABLE IF EXISTS "quiz_has_tag";

DROP TABLE IF EXISTS "attempt";

DROP TABLE IF EXISTS "answer";

DROP TABLE IF EXISTS "question";

DROP TABLE IF EXISTS "quiz";

DROP TABLE IF EXISTS "tag";

DROP TABLE IF EXISTS "level";

DROP TABLE IF EXISTS "user";

-- Table user
CREATE TABLE
  "user" (
    "id" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

-- Table level
CREATE TABLE
  "level" (
    "id" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

-- Table quiz
CREATE TABLE
  "quiz" (
    "id" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "published_at" TIMESTAMPTZ,
    "author_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

-- Table question
CREATE TABLE
  "question" (
    "id" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "description" TEXT NOT NULL,
    "anecdote" TEXT,
    "link" TEXT,
    "quiz_id" INT NOT NULL REFERENCES "quiz" ("id") ON DELETE CASCADE, -- Logique métier : si on supprime un quiz, on supprime ses questions (afin d'éviter d'avoir des questions orphelines)
    "level_id" INT NOT NULL REFERENCES "level" ("id") ON DELETE RESTRICT, -- Logique métier : on interdit la suppression d'un niveau si celui-ci est référencé par une question
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

-- ON DELETE CASCADE = si on supprime le quiz, alors toutes les questions qui référencent ce quiz seront supprimées automatiquement
-- ON DELETE SET NULL = si on supprime le quiz, alors le champ passe à null
-- ON DELETE RESTRICT = si on supprime le quiz, le SGBD ne nous laissera pas faire si une question le référence
-- Table answer
CREATE TABLE
  "answer" (
    "id" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "description" TEXT NOT NULL,
    "is_valid" BOOLEAN NOT NULL DEFAULT FALSE,
    "question_id" INT NOT NULL REFERENCES "question" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

-- Table tag
CREATE TABLE
  "tag" (
    "id" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "name" TEXT NOT NULL UNIQUE,
    "parent_id" INT REFERENCES "tag" ("id") ON DELETE SET NULL, -- Quand on supprime le parent, alors le tag enfant devient un tag 'racine'
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

-- Table quiz_has_tag (table de liaison N-N)
CREATE TABLE
  "quiz_has_tag" (
    "id" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "quiz_id" INT NOT NULL REFERENCES "quiz" ("id") ON DELETE CASCADE,
    "tag_id" INT NOT NULL REFERENCES "tag" ("id") ON DELETE CASCADE,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    UNIQUE ("quiz_id", "tag_id")
  );

-- Table attempt
CREATE TABLE
  "attempt" (
    "id" INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    "user_id" INT NOT NULL REFERENCES "user" ("id") ON DELETE CASCADE,
    "quiz_id" INT NOT NULL REFERENCES "quiz" ("id") ON DELETE CASCADE,
    "score_max" INT NOT NULL,
    "score" INT NOT NULL,
    "played_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (), -- logique métier
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW (), -- information technique
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW ()
  );

COMMIT;