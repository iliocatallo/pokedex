import { FunTranslationsLike } from "@app/FunDescriptionStyle.ts";

export class MockFunTranslations implements FunTranslationsLike {
  askedStyle?: "yoda" | "shakespeare";

  translate(style: "yoda" | "shakespeare") {
    this.askedStyle = style;
    return Promise.resolve("styled description");
  }
}
