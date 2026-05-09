// Tiny in-house i18n helper. We don't pull in a library — just JSON imports
// and a t() function that resolves dotted keys against the loaded locale.
import en from "./en.json";
import fr from "./fr.json";
import de from "./de.json";
import es from "./es.json";
import it from "./it.json";
import nl from "./nl.json";
import sv from "./sv.json";
import ar from "./ar.json";

export const locales = ["en", "fr", "de", "es", "it", "nl", "sv", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
  nl: "Nederlands",
  sv: "Svenska",
  ar: "العربية",
};

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  de: "ltr",
  es: "ltr",
  it: "ltr",
  nl: "ltr",
  sv: "ltr",
  ar: "rtl",
};

const dictionaries = { en, fr, de, es, it, nl, sv, ar } as const;

function getNested(obj: unknown, key: string): string | undefined {
  return key.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj) as string | undefined;
}

export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries[defaultLocale];
  const fallback = dictionaries[defaultLocale];

  return function t(key: string): string {
    return (
      getNested(dict, key) ?? getNested(fallback, key) ?? key
    );
  };
}

/**
 * Build a localized URL for a given path. The default locale lives at /,
 * other locales under /<locale>/. Trailing slashes are normalised so
 * `localizedPath('en', '/')` returns '/' and `localizedPath('fr', '/')` returns '/fr/'.
 */
export function localizedPath(locale: Locale, path: string = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) return clean === "/" ? "/" : clean;
  return clean === "/" ? `/${locale}/` : `/${locale}${clean}`;
}

/**
 * Detect the active locale from `Astro.url.pathname` (or any path string).
 * Returns the locale prefix or the default locale if the URL has none.
 */
export function getLocaleFromUrl(pathname: string): Locale {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg && (locales as readonly string[]).includes(seg)) return seg as Locale;
  return defaultLocale;
}
