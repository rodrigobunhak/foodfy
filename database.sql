CREATE TABLE "recipes" (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL,
  "chef_id" integer NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text NOT NULL
)

CREATE TABLE "chefs" (
	"id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" integer REFERENCES files(id),
  "created_at" timestamp NOT NULL
)

CREATE TABLE "files" (
	"id" serial PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
)

CREATE TABLE "recipe_files" (
	"id" serial PRIMARY KEY,
  'recipe_id' integer REFERENCES recipes(id),
  "file_ide" integer REFERENCES files(id)
)

