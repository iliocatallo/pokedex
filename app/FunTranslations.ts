import { FunTranslationsLike } from "@app/FunDescriptionStyle.ts";
import { retry } from "@std/async";

export class FunTranslations implements FunTranslationsLike {
  static withCache(): FunTranslationsLike {
    return new CachedFunTranslations(new FunTranslations());
  }

  async translate(
    style: "yoda" | "shakespeare",
    text: string,
  ): Promise<string | undefined> {
    try {
      return await retry(async () => {
        const response = await fetch(
          `https://api.funtranslations.mercxry.me/translate/${style}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          },
        );
        if (response.status === 429) return undefined;
        if (!response.ok) {
          await response.body?.cancel();
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        return data?.contents?.translated ?? undefined;
      });
    } catch {
      return undefined;
    }
  }
}

class CachedFunTranslations implements FunTranslationsLike {
  private cache: Map<string, string>;

  constructor(private inner: FunTranslationsLike) {
    this.cache = new Map<string, string>();
  }

  async translate(
    style: "yoda" | "shakespeare",
    text: string,
  ): Promise<string | undefined> {
    const key = `${style}:${text}`;
    if (this.cache.has(key)) return this.cache.get(key);
    const result = await this.inner.translate(style, text);
    if (result) this.cache.set(key, result);
    return result;
  }
}
