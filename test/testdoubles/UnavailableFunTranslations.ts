import { FunTranslationsLike } from "@app/FunDescriptionStyle.ts";

export class UnavailableFunTranslations implements FunTranslationsLike {
  translate() {
    return Promise.resolve(undefined);
  }
}
