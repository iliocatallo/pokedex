import { PokemonIndexViaPokeApi } from "@app/PokemonIndexViaPokeApi.ts";
import { StubPokeApi } from "./StubPokeApi.ts";
import { assertEquals, assertExists } from "@std/assert";

Deno.test("A PokeAPI species is mapped to a Pokemon", async () => {
  const index = new PokemonIndexViaPokeApi(
    new StubPokeApi({
      "mewtwo": {
        name: "mewtwo",
        is_legendary: true,
        habitat: { name: "rare" },
        flavor_text_entries: [
          { flavor_text: "EN description.", language: { name: "en" } },
          { flavor_text: "FR description.", language: { name: "fr" } },
        ],
      },
    }),
  );

  const pokemon = await index.lookup("mewtwo");

  assertEquals(pokemon, {
    name: "mewtwo",
    isLegendary: true,
    habitat: "rare",
    description: "EN description.",
  });
});

Deno.test("Newlines in the description are replaced with spaces", async () => {
  const index = new PokemonIndexViaPokeApi(
    new StubPokeApi({
      "mewtwo": {
        name: "mewtwo",
        is_legendary: true,
        habitat: { name: "rare" },
        flavor_text_entries: [
          { flavor_text: "EN\ndescription.", language: { name: "en" } },
        ],
      },
    }),
  );

  const pokemon = await index.lookup("mewtwo");

  assertExists(pokemon);
  assertEquals(pokemon.description, "EN description.");
});

Deno.test("A species with no habitat is mapped with habitat null", async () => {
  const index = new PokemonIndexViaPokeApi(
    new StubPokeApi({
      "garchomp": {
        name: "garchomp",
        is_legendary: false,
        habitat: null,
        flavor_text_entries: [
          { flavor_text: "EN description.", language: { name: "en" } },
        ],
      },
    }),
  );

  const pokemon = await index.lookup("garchomp");

  assertExists(pokemon);
  assertEquals(pokemon.habitat, null);
});

Deno.test("A species with no English description yields undefined", async () => {
  const index = new PokemonIndexViaPokeApi(
    new StubPokeApi({
      "pikachu": {
        name: "pikachu",
        is_legendary: false,
        habitat: "forest",
        flavor_text_entries: [
          { flavor_text: "FR\ndescription.", language: { name: "fr" } },
        ],
      },
    }),
  );

  assertEquals(await index.lookup("pikachu"), undefined);
});

Deno.test("A species that does not exist yields undefined", async () => {
  const index = new PokemonIndexViaPokeApi(
    new StubPokeApi({ "rony": undefined }),
  );

  assertEquals(await index.lookup("rony"), undefined);
});
