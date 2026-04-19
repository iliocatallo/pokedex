import { FunTranslationsLike } from "@app/FunDescriptionStyle.ts";
import { retry } from "@std/async";

export class FunTranslations implements FunTranslationsLike {
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
