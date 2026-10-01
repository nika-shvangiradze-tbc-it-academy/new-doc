import React from "react";
import { useTranslation } from "react-i18next";
import InternalPage from "./page/InternalPage";
import { InfoList } from "./page/ContentBlocks";
import toItems from "./page/toItems";

export default function ServiceDetails() {
  const { t, i18n } = useTranslation();

  const servicesDetails =
    i18n.language === "en"
      ? {
          1: {
            description:
              "A position as an assistant doctor in various fields + hospitation (for licensed doctors and also for bachelor graduates).",
          },
          2: {
            description:
              "Handling all bureaucratic matters (collecting, translating, and sending documents).",
          },
          3: {
            description:
              "Registration for the FSP exam.",
          },
          4: {
            description:
              "Support in obtaining a professional license (Berufserlaubnis).",
          },
          5: {
            description:
              "An intensive preparation course for the FSP exam based on the specific requirements of the respective federal state.",
          },
          6: {
            description:
              "Individual review of documentation for those who have completed “Internatur” or “Ordinatur” in post-Soviet countries.",
          },
        }
      : i18n.language === "gr"
      ? {
          1: {
            description:
              "Eine Stelle als Assistenzarzt in verschiedenen Bereichen + Hospitation (für approbierte Ärzte und auch für Bachelor-Absolventen).",
          },
          2: {
            description:
              "Erledigung aller bürokratischen Angelegenheiten (Sammeln, Übersetzen und Versenden von Dokumenten).",
          },
          3: {
            description:
              "Anmeldung zur FSP-Prüfung.",
          },
          4: {
            description:
              "Unterstützung bei der Erlangung einer Berufserlaubnis.",
          },
          5: {
            description:
              "Ein intensiver Vorbereitungskurs auf die FSP-Prüfung, der sich an den spezifischen Anforderungen des jeweiligen Bundeslandes orientiert.",
          },
          6: {
            description:
              "Die Möglichkeit, innerhalb von 1 bis 2 Jahren nach Arbeitsbeginn einen Termin für die Zulassungsprüfung zu erhalten, ohne einen Wohnsitz in Georgien zu haben.",
          },
        }
      : {
          1: {
            description:
              "სამუშაო ადგილს სხვადასხვა სფეროში ასისტენტ-ექიმის პოზიციაზე (Zusage der Stelle) + ჰოსპიტაცია (როგორც ლიცენზირებული ექიმებისთვის ისე მხოლოდ ბაკალავრდამთავრებულებისთვის).",
          },
          2: {
            description:
              "ყველანაირი ბიუროკრატიული საკითხის მოგვარებას (საბუთების შეგროვება-თარგმნა-გაგზავნა).",
          },
          3: {
            description:
              "FSP-ის გამოცდაზე რეგისტრაციას.",
          },
          4: {
            description:
              "მხარდაჭერას პროფესიული ლიცენზიის მოპოვებაში (Berufserlaubnis).",
          },
          5: {
            description:
              "ინტენსიურ მოსამზადებელ კურსს FSP-სთვის, რომელიც ეფუძნება შესაბამისი ფედერალური სახელმწიფოს სპეციფიკურ მოთხოვნებს.",
          },
          6: {
            description:
              "დოკუმენტაციის ინდივიდუალურ გადამოწმებას, ვისაც გავლილი აქვს ორდინატურა ან ინტერნატურა პოსტსაბჭოთა ქვეყნებში.",
          },
        };

  return (
    <InternalPage
      variant="list"
      title={t("team_h1")}
      image="/images/tm.jpg"
      imageAlt="Silhouettes of a team celebrating on a mountain summit at sunset"
      imagePosition="46% center"
    >
      <InfoList items={toItems(servicesDetails)} />
    </InternalPage>
  );
}
