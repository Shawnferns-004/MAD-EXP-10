import i18next from "i18next";
import Backend from "i18next-fs-backend";
import Middleware from "i18next-http-middleware";

i18next
  .use(Backend)
  .use(Middleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: { loadPath: "./locales/{{lng}}.json" },
  });

export default i18next;
