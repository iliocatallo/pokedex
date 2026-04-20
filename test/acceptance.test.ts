import { assertEquals } from "@std/assert";
import { Pokedex } from "@app/Pokedex.ts";
import { HttpResponse } from "@app/HttpResponse.ts";
import { PokemonIndexViaPokeApi } from "@app/PokemonIndexViaPokeApi.ts";
import { FunDescriptionStyle } from "@app/FunDescriptionStyle.ts";
import { Http } from "./Http.ts";
import { StubPokeApi } from "./testdoubles/StubPokeApi.ts";
import { UnavailableFunTranslations } from "./testdoubles/UnavailableFunTranslations.ts";
import { StylePrefixFunTranslations } from "./testdoubles/StylePrefixFunTranslations.ts";

const PORT = 2222;

Deno.test("/pokemon/<name> returns the Pokemon's information", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new PokemonIndexViaPokeApi(
      new StubPokeApi({
        mewtwo: {
          name: "mewtwo",
          is_legendary: true,
          habitat: { name: "rare" },
          flavor_text_entries: [
            {
              flavor_text: "A scientist created it after years of experiments.",
              language: { name: "en" },
            },
          ],
        },
      }),
    ),
    styledWith: new FunDescriptionStyle(new StylePrefixFunTranslations()),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/mewtwo"),
    HttpResponse.ok({
      name: "mewtwo",
      isLegendary: true,
      habitat: "rare",
      description: "A scientist created it after years of experiments.",
    }),
  );
});

Deno.test("/pokemon/<name> returns 404 for an unknown Pokemon", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new PokemonIndexViaPokeApi(new StubPokeApi({})),
    styledWith: new FunDescriptionStyle(new StylePrefixFunTranslations()),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/rony"),
    HttpResponse.notFound(),
  );
});

Deno.test("/pokemon/translated/<name> returns a legendary Pokemon with a Yoda-styled description", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new PokemonIndexViaPokeApi(
      new StubPokeApi({
        mewtwo: {
          name: "mewtwo",
          is_legendary: true,
          habitat: { name: "rare" },
          flavor_text_entries: [
            {
              flavor_text: "A scientist created it after years of experiments.",
              language: { name: "en" },
            },
          ],
        },
      }),
    ),
    styledWith: new FunDescriptionStyle(new StylePrefixFunTranslations()),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/translated/mewtwo"),
    HttpResponse.ok({
      name: "mewtwo",
      isLegendary: true,
      habitat: "rare",
      description: "[yoda] A scientist created it after years of experiments.",
    }),
  );
});

Deno.test("/pokemon/translated/<name> returns a cave-habitat Pokemon with a Yoda-styled description", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new PokemonIndexViaPokeApi(
      new StubPokeApi({
        zubat: {
          name: "zubat",
          is_legendary: false,
          habitat: { name: "cave" },
          flavor_text_entries: [
            {
              flavor_text: "Uses ultrasonic waves to identify targets.",
              language: { name: "en" },
            },
          ],
        },
      }),
    ),
    styledWith: new FunDescriptionStyle(new StylePrefixFunTranslations()),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/translated/zubat"),
    HttpResponse.ok({
      name: "zubat",
      isLegendary: false,
      habitat: "cave",
      description: "[yoda] Uses ultrasonic waves to identify targets.",
    }),
  );
});

Deno.test("/pokemon/translated/<name> returns any other Pokemon with a Shakespeare-styled description", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new PokemonIndexViaPokeApi(
      new StubPokeApi({
        pikachu: {
          name: "pikachu",
          is_legendary: false,
          habitat: { name: "forest" },
          flavor_text_entries: [
            {
              flavor_text: "Its electricity could cause lightning storms.",
              language: { name: "en" },
            },
          ],
        },
      }),
    ),
    styledWith: new FunDescriptionStyle(new StylePrefixFunTranslations()),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/translated/pikachu"),
    HttpResponse.ok({
      name: "pikachu",
      isLegendary: false,
      habitat: "forest",
      description:
        "[shakespeare] Its electricity could cause lightning storms.",
    }),
  );
});

Deno.test("/pokemon/translated/<name> returns the Pokemon with the standard description when FunTranslations is unavailable", async () => {
  await using pokedex = new Pokedex({
    onPort: PORT,
    backedBy: new PokemonIndexViaPokeApi(
      new StubPokeApi({
        mewtwo: {
          name: "mewtwo",
          is_legendary: true,
          habitat: { name: "rare" },
          flavor_text_entries: [
            {
              flavor_text: "A scientist created it after years of experiments.",
              language: { name: "en" },
            },
          ],
        },
      }),
    ),
    styledWith: new FunDescriptionStyle(new UnavailableFunTranslations()),
  });
  await pokedex.ready;

  assertEquals(
    await Http.callOn(PORT, "/pokemon/translated/mewtwo"),
    HttpResponse.ok({
      name: "mewtwo",
      isLegendary: true,
      habitat: "rare",
      description: "A scientist created it after years of experiments.",
    }),
  );
});
