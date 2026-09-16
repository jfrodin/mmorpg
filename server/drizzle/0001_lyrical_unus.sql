CREATE TABLE "character_skills" (
	"id" text PRIMARY KEY NOT NULL,
	"character_id" text NOT NULL,
	"skill" text NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "character_skills_character_id_skill_unique" UNIQUE("character_id","skill")
);
--> statement-breakpoint
CREATE TABLE "inventory_items" (
	"id" text PRIMARY KEY NOT NULL,
	"character_id" text NOT NULL,
	"item_id" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "inventory_items_character_id_item_id_unique" UNIQUE("character_id","item_id")
);
--> statement-breakpoint
ALTER TABLE "character_skills" ADD CONSTRAINT "character_skills_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_character_id_characters_id_fk" FOREIGN KEY ("character_id") REFERENCES "public"."characters"("id") ON DELETE cascade ON UPDATE no action;