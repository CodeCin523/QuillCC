import { describe, it, expect, beforeAll } from "vitest";
import i18n from "./i18n.js";

describe("i18n setup", () => {

  // ensure i18n is initialized before tests run
  beforeAll(async () => {
    // i18n.init is async internally in some setups
    if (!i18n.isInitialized) {
      await i18n.init();
    }
  });

  it("has English translations", () => {
    const t = i18n.getFixedT("en");

    expect(t("login")).toBe("Login");
    expect(t("logout")).toBe("Logout");
    expect(t("settings")).toBe("Settings");
    expect(t("username")).toBe("Username");
  });

  it("has French translations", () => {
    const t = i18n.getFixedT("fr");

    expect(t("login")).toBe("Connexion");
    expect(t("logout")).toBe("Déconnexion");
    expect(t("settings")).toBe("Paramètres");
    expect(t("username")).toBe("Nom d'utilisateur");
  });

  it("falls back to key when translation is missing", () => {
    const t = i18n.getFixedT("en");

    expect(t("this_key_does_not_exist")).toBe("this_key_does_not_exist");
  });

  it("can switch language at runtime", async () => {
    await i18n.changeLanguage("fr");

    expect(i18n.language).toBe("fr");
    expect(i18n.t("login")).toBe("Connexion");
  });

});