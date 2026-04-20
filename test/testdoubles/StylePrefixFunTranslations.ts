import { FunTranslationsLike } from "@app/FunDescriptionStyle.ts";

export class StylePrefixFunTranslations implements FunTranslationsLike {
  translate(style: "yoda" | "shakespeare", text: string) {
    return Promise.resolve(`[${style}] ${text}`);
  }
}
