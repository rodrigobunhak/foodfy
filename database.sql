DROP DATABASE IF EXISTS foodfy
CREATE DATABASE foodfy

CREATE TABLE "recipes" (
  "id" serial PRIMARY KEY,
  "title" text NOT NULL,
  "chef_id" integer NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text NOT NULL,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
)

CREATE TABLE "files" (
	"id" serial PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
)

CREATE TABLE "chefs" (
	"id" serial PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" integer,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
)

-- create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at chefs
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();



CREATE TABLE "recipe_files" (
	"id" serial PRIMARY KEY,
  "recipe_id" integer,
  "file_id" integer
)

-- foreign key
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id") ON DELETE CASCADE;

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id") ON DELETE CASCADE;


