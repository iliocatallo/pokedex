import { assertEquals } from "@std/assert";
import { FunDescriptionStyle } from "@app/FunDescriptionStyle.ts";
import { MockFunTranslations } from "./MockFunTranslations.ts";

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
