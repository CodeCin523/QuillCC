import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translations
const resources = {
  en: {
    translation: {
      login: "Login",
      logout: "Logout",
      register: "Register",
      settings: "Settings",
      username: "Username",
      email: "Email",
      password: "Password",
      logoUrl: "Logo URL",
      submit: "Submit",
      update: "Update",
      loggingOut: "Logging out...",
      logoutConfirmation: "Are you sure you want to log out?",
      yes: "Yes",
      no: "No",
      successfully: "successfully",
      noAccount: "Don't have an account?",
      fileSaved: "File saved successfully!",
      fileSaveError: "Error saving file!",
      loadingWorkspace: "Loading workspace...",
    },
  },
  fr: {
    translation: {
      login: "Connexion",
      logout: "Déconnexion",
      register: "Inscription",
      settings: "Paramètres",
      username: "Nom d'utilisateur",
      email: "Email",
      password: "Mot de passe",
      logoUrl: "URL du logo",
      submit: "Envoyer",
      update: "Mettre à jour",
      loggingOut: "Déconnexion en cours...",
      logoutConfirmation: "Êtes-vous sûr de vouloir vous déconnecter ?",
      yes: "Oui",
      no: "Non",
      successfully: "avec succès",
      noAccount: "Vous n'avez pas de compte?",
      fileSaved: "Fichier enregistré avec succès !",
      fileSaveError: "Erreur lors de l'enregistrement du fichier !",
      loadingWorkspace: "Chargement de l'espace de travail...",
    },
  },
};

i18n
  .use(LanguageDetector) // detects user language automatically
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;