import { assertEquals } from "@std/assert";
import { FunDescriptionStyle } from "@app/FunDescriptionStyle.ts";
import { MockFunTranslations } from "./MockFunTranslations.ts";
import { UnavailableFunTranslations } from "./UnavailableFunTranslations.ts";

Deno.test("The description of a legendary Pokémon is styled with the Yoda translation", async () => {
  const api = new MockFunTranslations();
  const style = new FunDescriptionStyle(api);

  await style.applyTo({
    name: "mewtwo",
    isLegendary: true,
    habitat: "rare",
    description: "legendary pokemon",
  });

  assertEquals(api.askedStyle, "yoda");
});

Deno.test("The description of a cave-habitat Pokemon is styled with the Yoda translation", async () => {
  const api = new MockFunTranslations();
  const style = new FunDescriptionStyle(api);

  await style.applyTo({
    name: "zubat",
    isLegendary: false,
    habitat: "cave",
    description: "uses ultrasonic waves",
  });

  assertEquals(api.askedStyle, "yoda");
});

Deno.test("The description of all but legendary and cave-habitat Pokemons is styled with the Shakespeare translation", async () => {
  const api = new MockFunTranslations();
  const style = new FunDescriptionStyle(api);

  await style.applyTo({
    name: "pikachu",
    isLegendary: false,
    habitat: "forest",
    description: "their electricity could cause lightning storms",
  });

  assertEquals(api.askedStyle, "shakespeare");
});

Deno.test("The description of any Pokemon is left untouched in case of problems interacting with FunTranslations", async () => {
  const api = new UnavailableFunTranslations();
  const style = new FunDescriptionStyle(api);

  const { description: styledDescription } = await style.applyTo({
    name: "snorlax",
    isLegendary: false,
    habitat: "mountain",
    description: "very lazy",
  });

  assertEquals(styledDescription, "very lazy");
});
