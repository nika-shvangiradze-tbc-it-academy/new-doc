import React from "react";
import { useTranslation } from "react-i18next";
import InternalPage from "./page/InternalPage";
import { Timeline } from "./page/ContentBlocks";
import toItems from "./page/toItems";

export default function ServiceExam() {
  const { t, i18n } = useTranslation();

  const documentDetails =
    i18n.language == "en"
      ? {
          1: {
            title: "",
            description: `Obtain a confirmation from your future employer that you intend to take up a medical
  position at their clinic. `,
          },
          2: {
            title: "",
            description: ` This confirmation and the application for medical licensure/professional permit must
  be submitted to the State Examination Office for Health and Medical Professions
  (Approbation authority).
  `,
          },
          3: {
            description: ` Registration for the German language test at the Medical Association. The
  following documents must be submitted:
  `,
            title: ` • Completed application form
   • Copy of the acknowledgment of receipt from the Approbation authority for the
  licensure/professional permit
   • Language certificate B2 or higher (not older than 5 years)
   • Copy of the passport`,
          },
          4: {
            description: ` The examinee will receive the following documents from the Medical
  Association:
  `,
            title: `•  Acknowledgment of receipt and an invoice for fees (€430.00-570.00)
  •  An invitation to the exam upon receipt of the exam fee
  •   w The exam date (from 1 to 6 months)`,
          },
          5: {
            title: "",
            description: `Upon passing the exam, the examinee will receive a certificate from the Medical
  Association. Re-examinations are possible.
  `,
          },
        }
      : i18n.language == "gr"
      ? {
          1: {
            title: "",
            description: `Lassen Sie sich von Ihrem zukünftigen Arbeitgeber eine Bestätigung geben, dass Sie bei ihm die Aufnahme einer ärztlichen Tätigkeit beabsichtigen. `,
          },
          2: {
            title: "",
            description: ` Diese Bestätigung und der Antrag auf ärztliche Approbation/Berufserlaubnis müssen
  beim Landesprüfungsamt für Gesundheits- und Medizinalberufe
  (Approbationsbehörde) eingereicht werden.
  `,
          },
          3: {
            description: ` Anmeldung zum Deutschtest bei der Ärztekammer. Die
  müssen folgende Unterlagen eingereicht werden:
  `,
            title: ` •Ausgefülltes Antragsformular
   • Kopie der Empfangsbestätigung der Zulassungsbehörde für die
  Approbation/Berufserlaubnis
   •  Sprachzeugnis B2 oder höher (nicht älter als 5 Jahre)
   •  Kopie des Reisepasses `,
          },
          4: {
            description: ` Der Prüfling erhält von der Ärztekammer die folgenden Unterlagen
  Ärztekammer:
  `,
            title: `• Empfangsbestätigung und Rechnung über die Gebühren (430,00-570,00 €)
  • Eine Einladung zur Prüfung nach Eingang der Prüfungsgebühr
  • w Der Prüfungstermin (zwischen 1 und 6 Monaten)`,
          },
          5: {
            title: "",
            description: `Nach bestandener Prüfung erhält der Prüfling ein Zertifikat von der Ärztekammer.
  Ärztekammer. Wiederholungsprüfungen sind möglich.

  `,
          },
        }
      : {
          1: {
            title: "",
            description: `მიიღეთ თქვენი მომავალი დამსაქმებლისგან დამადასტურებელი საბუთი (Zusage
der Stelle), რომ თქვენ გეგმავთ სამედიცინო საქმიანობის დაწყებას მის კლინიკაში. `,
          },
          2: {
            title: "",
            description: ` ეს საბუთი და აპრობაციის / პროფესიული ნებართვის გაცემის განაცხადი უნდა
წარადგინოთ შესაბამისი ფედერალური მიწის ჯანმრთელობისა და სამკურნალო
პროფესიების სახელმწიფო საგამოცდო კომიტეტში (აპრობაციის ორგანო).
  `,
          },
          3: {
            description: ` რეგისტრაცია სამედიცინო გერმანული ენის გამოცდაზე. საჭიროა შემდეგი
დოკუმენტების წარდგენა:
  `,
            title: ` • შევსებული განაცხადის ფორმა
   • აპრობაციის ორგანოს მიერ გაცემული აპრობაციის / პროფესიული
ნებართვის მიღების დადასტურების ასლი
   • ენის სერთიფიკატი B2 ან უფრო მაღალი (რომელიც არ არის 5 წელზე მეტი ხნის)
   • პასპორტის ასლი`,
          },
          4: {
            description: ` გამოცდის მონაწილე მიიღებს შემდეგ დოკუმენტებს სამედიცინო პალატისგან:
  `,
            title: `•  საბუთების მიღების დადასტურება და გადასახადის ქვითარს (430,00-დან 570,00
ევრომდე, ფედერალური მიწის მიხედვით)
  •  მოწვევა გამოცდაზე, როგორც კი გადახდის მტკიცებულება იქნება მიღებული
  •   გამოცდის თარიღი (1იდან 6 თვემდე)`,
          },
          5: {
            title: "",
            description: `გამოცდის წარმატებით ჩაბარების შემთხვევაში, მონაწილე მიიღებს სამედიცინო
პალატის სერტიფიკატს. გამოცდის ხელახლა ჩაბარება შესაძლებელია სამი თვის
შემდეგ.
  `,
          },
        };

  return (
    <InternalPage
      variant="process"
      title={t("exam_h1")}
      image="/images/prepare.jpg"
      imageAlt="Open notebook and pen in front of a laptop on a sunlit desk"
      imagePosition="38% center"
    >
      <Timeline items={toItems(documentDetails)} />
    </InternalPage>
  );
}
