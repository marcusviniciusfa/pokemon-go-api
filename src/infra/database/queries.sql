drop table pokemons;

create table pokemons (
  id integer,
  name text,
  pokedex_ref integer,
  image_name text,
  generation integer,
  evolution_stage text,
  evolved integer,
  family_id integer,
  type_1 text,
  type_2 text,
  weather_1 text,
  weather_2 text,
  stat_total integer,
  attack integer,
  defense integer,
  stamina integer,
  legendary integer
);

delete from pokemons;

select * from pokemons order by id asc limit 10;

select count(*) from pokemons;
