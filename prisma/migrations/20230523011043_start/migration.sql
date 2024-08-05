-- CreateTable
CREATE TABLE "pokemons" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "pokedex_ref" INTEGER,
    "image_name" TEXT,
    "generation" INTEGER,
    "evolution_stage" TEXT,
    "evolved" INTEGER,
    "family_id" INTEGER,
    "type_1" TEXT,
    "type_2" TEXT,
    "weather_1" TEXT,
    "weather_2" TEXT,
    "stat_total" INTEGER,
    "attack" INTEGER,
    "defense" INTEGER,
    "stamina" INTEGER,
    "legendary" INTEGER,

    CONSTRAINT "pokemons_pkey" PRIMARY KEY ("id")
);
