"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Check, ChevronDown, Languages } from "lucide-react";

export type Locale = "pt" | "en" | "de";

const localeNames: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  de: "DE",
};

const localeDisplayNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
  de: "Deutsch",
};

const languageLabels: Record<Locale, string> = {
  pt: "Idioma",
  en: "Language",
  de: "Sprache",
};

const common = {
  pt: {
    product: "Produto",
    evolution: "Visão",
    example: "Exemplo",
    plans: "Planos",
    survey: "Pesquisa",
    builder: "Começar grátis",
    builderActive: "Demonstração",
    login: "Entrar",
    navigation: "Navegação principal",
    home: "Forjavia, início",
    footerNav: "Links do rodapé",
    footerLine: "Construir com método. Evoluir com clareza.",
  },
  en: {
    product: "Product",
    evolution: "Vision",
    example: "Example",
    plans: "Plans",
    survey: "Survey",
    builder: "Start free",
    builderActive: "Demo",
    login: "Sign in",
    navigation: "Main navigation",
    home: "Forjavia, home",
    footerNav: "Footer links",
    footerLine: "Build with method. Evolve with clarity.",
  },
  de: {
    product: "Produkt",
    evolution: "Vision",
    example: "Beispiel",
    plans: "Preise",
    survey: "Umfrage",
    builder: "Kostenlos starten",
    builderActive: "Demo",
    login: "Anmelden",
    navigation: "Hauptnavigation",
    home: "Forjavia, Startseite",
    footerNav: "Links in der Fußzeile",
    footerLine: "Mit Methode bauen. Mit Klarheit wachsen.",
  },
} as const;

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  common: (typeof common)[Locale];
};

const I18nContext = createContext<I18nValue | null>(null);

function detectLocale(): Locale {
  const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const language of languages) {
    const base = language.toLowerCase().split("-")[0];
    if (base === "pt" || base === "en" || base === "de") return base;
  }
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, updateLocale] = useState<Locale>("pt");

  useEffect(() => {
    const saved = localStorage.getItem("forjavia-locale") as Locale | null;
    // Browser preference becomes available only after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateLocale(saved && saved in localeNames ? saved : detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "pt" ? "pt-BR" : locale;
  }, [locale]);

  const value = useMemo<I18nValue>(() => ({
    locale,
    common: common[locale],
    setLocale(next) {
      localStorage.setItem("forjavia-locale", next);
      updateLocale(next);
    },
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <details className="language-menu">
      <summary aria-label={`${languageLabels[locale]}: ${localeDisplayNames[locale]}`}>
        <Languages size={15} aria-hidden="true" />
        <span>{localeNames[locale]}</span>
        <ChevronDown size={13} aria-hidden="true" />
      </summary>
      <div className="language-menu-popover" role="group" aria-label={languageLabels[locale]}>
        <span className="language-menu-label">{languageLabels[locale]}</span>
        {(Object.keys(localeNames) as Locale[]).map((item) => (
          <button
            type="button"
            aria-pressed={locale === item}
            className={locale === item ? "active" : undefined}
            key={item}
            onClick={(event) => {
              setLocale(item);
              event.currentTarget.closest("details")?.removeAttribute("open");
            }}
          >
            <span className="language-code">{localeNames[item]}</span>
            <span>{localeDisplayNames[item]}</span>
            {locale === item && <Check size={14} aria-hidden="true" />}
          </button>
        ))}
      </div>
    </details>
  );
}
