import i18next, { i18n } from "i18next";
import I18NexFsBackend from "i18next-fs-backend";

export default async () => {
    const text : i18n = i18next.createInstance();
    await text
        .use(I18NexFsBackend)
        .init({
            fallbackLng: "uk",
            ns: [ "basic" ],
            ignoreJSONStructure: false,
            keySeparator: ".",
            backend: {
                loadPath: "./src/i18n/locales/{{lng}}/{{ns}}.json"
            },
            supportedLngs: [
                "uk"
            ],
            interpolation: {
                escapeValue: false
            }
        });
        
    return text;
}