import React from "react";
import { useTranslation } from "react-i18next";
import InternalPage from "./page/InternalPage";
import { DocList } from "./page/ContentBlocks";
import toItems from "./page/toItems";

export default function ServiceDocuments() {
  const { t, i18n } = useTranslation();

  const documentDetails =
    i18n.language == "en"
      ? {
          1: {
            title: "",
            description: "Passport",
          },
          2: {
            title: "",
            description: "Birth certificate ",
          },
          3: {
            title: "",
            description: "Resume",
          },
          4: {
            title: "",
            description: "Diploma + Annex ",
          },
          9: {
            title: "",
            description:
              "Registration Certificate from Germany",
          },
          5: {
            title: "",
            description:
              "Medical certificate with vaccinations.",
          },
          6: {
            title: "",
            description:
              "Criminal record certificate, not older than 3 months.",
          },
          7: {
            description:
              "At least a B2-level German language certificate (Goethe-Institut, TELC, TestDaF, ÖSD, DSH, ECL).",
            title: `•  Goethe-Institut
        • TELC (The European Language Certificates)
        • TestDaF (Test Deutsch als Fremdsprache)
        • ÖSD (Austrian German Language Diploma)
        • DSH (German Language Test for University Admission)
        • ECL (European Consortium for the Certificate of Attainment in Modern Languages)`,
          },
          8: {
            title: "",
            description:
              "For Kenntnisprüfung: an additional 6-year university curriculum is required.",
          },
        }
      : i18n.language == "gr"
      ? {
          1: {
            title: "",
            description: "Reisepass",
          },
          2: {
            title: "",
            description: "Geburtsurkunde",
          },
          3: {
            title: "",
            description: "Lebenslauf",
          },
          4: {
            title: "",
            description:
              "Abschlusszeugnis + Anhang ",
          },
          9: {
            title: "",
            description:
              "Meldebescheinigung aus Deutschland",
          },
          5: {
            title: "",
            description:
              "Ärztliches Attest mit Impfungen.",
          },
          6: {
            title: "",
            description:
              "Strafregisterbescheinigung, nicht älter als 3 Monate.",
          },
          7: {
            description:
              "Mindestens ein deutsches Sprachzertifikat auf B2-Niveau (Goethe-Institut, TELC, TestDaF, ÖSD, DSH, ECL).",
            title: `•  Goethe-Institut
        • TELC (Die Europäischen Sprachenzertifikate)
        • TestDaF (Test of German as a Foreign Language)
        • ÖSD (Österreichisches Sprachdiplom Deutsch)
        • DSH (Deutsche Sprachprüfung für den Hochschulzugang)
        • ECL (European Consortium for the Certificate of Attainment in Modern Languages)`,
          },
          8: {
            title: "",
            description:
              "Für die Kenntnisprüfung ist ein zusätzliches 6-jähriges Hochschulstudium erforderlich.",
          },
        }
      : {
          1: {
            title: "",
            description: "პასპორტი",
          },
          2: {
            title: "",
            description: "დაბადების მოწმობა",
          },
          3: {
            title: "",
            description: "რეზიუმე",
          },
          4: {
            title: "",
            description: "დიპლომი + დანართი ",
          },
          9: {
            title: "",
            description:
              "რეგისტრაციის დამადასტურებელი დოკუმენტი გერმანიიდან",
          },
          5: {
            title: "",
            description:
              "სამედიცინო ცნობა ვაქცინაციით.",
          },
          6: {
            title: "",
            description:
              "ნასამართლეობის ცნობა არაუმეტეს 3 თვის",
          },
          7: {
            description:
              "მინიმუმ ბ2 დონის GER (Gemeinsame Europäische Referenzrahmen) აღიარებული გერმანული ენის სერტიფიკატი:",
            title: `•  Goethe-Institut
          • TELC (The European Language Certificates)
          • TestDaF (Test Deutsch als Fremdsprache)
          • ÖSD (Austrian German Language Diploma)
          • DSH (German Language Test for University Admission)
          • ECL (European Consortium for the Certificate of Attainment in Modern Languages)`,
          },
          8: {
            title: "",
            description:
              "ვისაც სააპრობაციო გამოცდაზე გასვლის სურვილი აქვთ, დამატებით ესაჭიროებათ უნივერსიტეტის 6 წლიანი სილაბუსი.",
          },
        };

  return (
    <InternalPage
      variant="documents"
      title={t("document_h1")}
      image="/images/guidance.jpg"
      imageAlt="Compass resting on a printed sheet of figures, symbolising guidance"
      imagePosition="52% center"
    >
      <DocList items={toItems(documentDetails)} marker="check" />
    </InternalPage>
  );
}
