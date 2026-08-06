import * as cheerio from "cheerio";

export async function scrapeRecipeContent(url: string): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (RecipeStockBot)" },
    });
    clearTimeout(timeout);

    if (!res.ok) return "";

    const html = await res.text();
    const $ = cheerio.load(html);

    // 1. JSON-LD (schema.org Recipe) を優先
    const jsonLdContent = extractFromJsonLd($);
    if (jsonLdContent) return jsonLdContent;

    // 2. og:description / meta description にフォールバック
    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content");
    if (description) return description.trim();

    return "";
  } catch {
    return "";
  }
}

function extractFromJsonLd($: cheerio.CheerioAPI): string {
  const scripts = $('script[type="application/ld+json"]');

  for (const el of scripts.toArray()) {
    try {
      const raw = JSON.parse($(el).text());
      const items = Array.isArray(raw) ? raw : [raw, ...(raw["@graph"] ?? [])];

      for (const item of items) {
        const types = Array.isArray(item?.["@type"])
          ? item["@type"]
          : [item?.["@type"]];
        if (!types.includes("Recipe")) continue;

        const instructions = item.recipeInstructions;
        if (!instructions) continue;

        if (typeof instructions === "string") return instructions.trim();

        if (Array.isArray(instructions)) {
          const steps = instructions.map((step, i) => {
            const text =
              typeof step === "string" ? step : (step.text ?? step.name ?? "");
            return `${i + 1}. ${text}`.trim();
          });
          return steps.filter(Boolean).join("\n");
        }
      }
    } catch {
      continue;
    }
  }
  return "";
}
