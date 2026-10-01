import React from "react";
import { useTranslation } from "react-i18next";
import InternalPage from "./page/InternalPage";
import { Timeline } from "./page/ContentBlocks";
import toItems from "./page/toItems";

export default function ServicePrepare() {
  const { t, i18n } = useTranslation();

  const documentDetails =
    i18n.language == "en"
      ? {
          1: {
            title: "",
            description: `Documents (requirements, patient file, phone call, vocabulary list): you will first receive a medical request form that must be fully completed.
  Next, you will be given further information about your patient in the form of a file that
  may include a medical report, findings from CT, X-ray, ultrasound, endoscopy, and
  laboratory results. A colleague will also provide information about the patient (film). `,
          },
          2: {
            title: "",
            description: `The
  laboratory will contact you by phone to provide lab results for another patient, which
  you must later relay correctly with name and date of birth. At the end of this part of the
  exam, you will receive a vocabulary list with medical terms that you must translate into
  layman’s terms. In this task, you must also understand and mark anatomical locations
  on a diagram (e.g., “below the right knee joint”). You have 40 minutes for this part of the
  exam.`,
          },
          3: {
            title: "",
            description: `information (film), and the call from the laboratory. After the patient presentation, the
  two doctors (examiners) may ask you questions.`,
          },
          4: {
            title: "",
            description: `Exam Aids At the start of the exam, each examinee receives anamnesis sheets, a pen,
  and paper for notes. The notes are not part of the exam evaluation. Additional aids
  (medical reference materials) will be provided. During the exam, communication with
  third parties and the use of other aids (books, scientific articles, internet) are
  prohibited.`,
          },
        }
      : i18n.language == "gr"
      ? {
          1: {
            title: "",
            description: `Dokumente (Anforderungen, Patientenakte, Telefonat, Vokabelliste): Sie erhalten zunächst ein medizinisches Anforderungsformular, das vollständig ausgefüllt werden muss.
  Anschließend erhalten Sie weitere Informationen über Ihren Patienten in Form einer Akte, die
  die einen medizinischen Bericht, CT-, Röntgen-, Ultraschall- und Endoskopiebefunde sowie
  Laborergebnisse. Auch ein Kollege wird Ihnen Informationen über den Patienten geben (Film). `,
          },
          2: {
            title: "",
            description: `Das
  Das Labor wird sich telefonisch mit Ihnen in Verbindung setzen, um Ihnen die Laborergebnisse eines anderen Patienten mitzuteilen, die
  die Sie später korrekt mit Namen und Geburtsdatum weitergeben müssen. Am Ende dieses Teils der Prüfung
  Prüfung erhalten Sie eine Vokabelliste mit medizinischen Begriffen, die Sie in Laiensprache übersetzen müssen.
  Laienbegriffe übersetzen müssen. In dieser Aufgabe müssen Sie auch anatomische Stellen verstehen und markieren
  auf einem Diagramm markieren (z. B. „unterhalb des rechten Kniegelenks“). Für diesen Teil der Prüfung haben Sie 40 Minuten Zeit.
  Prüfung.`,
          },
          3: {
            title: "",
            description: `Informationen (Film) und den Anruf des Labors. Nach der Vorstellung des Patienten können die
  können die beiden Ärzte (Untersucher) Ihnen Fragen stellen.`,
          },
          4: {
            title: "",
            description: `Prüfungshilfsmittel Zu Beginn der Prüfung erhält jeder Prüfling Anamnesebögen, einen Stift,
  und Papier für Notizen. Die Notizen gehen nicht in die Bewertung der Prüfung ein. Zusätzliche Hilfsmittel
  (medizinische Nachschlagewerke) werden zur Verfügung gestellt. Während der Prüfung ist die Kommunikation mit
  mit Dritten und die Verwendung anderer Hilfsmittel (Bücher, wissenschaftliche Artikel, Internet)
  verboten.`,
          },
        }
      : {
          1: {
            title: "",
            description: `ზოგ ფედერალურ მიწაზე არის დამატებითი ნაწილიც:
დოკუმენტები (კვლევები, დაავადების ისტორია, სატელეფონო ზარი, ლექსიკონი)
გამოცდის ამ ნაწილში მიიღებთ კვლევების მოთხოვნის ფურცელს, რომელიც
სრულად უნდა შეავსოთ.
შემდეგ მოგეცემათ პაციენტის შესახებ დამატებითი ინფორმაცია, რომელშიც
შესაძლოა შედიოდეს ექიმის ჩანაწერები, CT, რენტგენის, ულტრაბგერის,
ენდოსკოპიისა და ასევე ლაბორატორიული შედეგები.
ასევე, კოლეგა მოგაწვდით ვიდეო-ჩანაწერს პაციენტის შესახებ. `,
          },
          2: {
            title: "",
            description: `ლაბორატორია დაგიკავშირდებათ ტელეფონით და გადმოგცემთ სხვა პაციენტის
ლაბორატორიულ მონაცემებს, რომელთა სახელი და დაბადების თარიღი თქვენ
მოგვიანებით სწორად უნდა მოახსენოთ.
გამოცდის ამ ნაწილის ბოლოს მიიღებთ ლექსიკონს სპეციალური ტერმინებით,
რომლებიც უნდა გადმოიტანოთ პაციენტისთვის გასაგებად, არალათინური
ტერმინოლოგიით. ამ დავალების შესრულებისას თქვენ ასევე უნდა შემოხაზოთ ან
გადახაზოთ ფოტოზე მინიშნებული ანატომიური ადგილები, იმის მიხედვით თუ
რას ითხოვს მოცემულობა (მაგ. „მარჯვენა მუხლის ქვემოთ“).
ამ ნაწილზე გაქვთ 40 წუთი.`,
          },

          4: {
            title: "",
            description: `გამოცდის დაწყებისას ყოველი მონაწილე იღებს ანამნეზის ფურცელს, კალამსა და
ქაღალდს ჩანაწერებისთვის. ჩანაწერები არ იქნება შეფასებული გამოცდისას.
დამატებითი დახმარების საშუალებები (სამედიცინო ცნობარები) ასევე იქნება
გათვალისწინებული. გამოცდის დროს აკრძალულია კომუნიკაცია მესამე
პირებთან და სხვა დამხმარე საშუალებების (წიგნები, სამეცნიერო სტატიები,
ინტერნეტი) გამოყენება.`,
          },
        };

  return (
    <InternalPage
      variant="process"
      title={t("prepare_h1")}
      image="/images/document-2.jpg"
      imageAlt="Application forms and a notebook laid out on a white wooden table"
      imagePosition="42% center"
    >
      <Timeline items={toItems(documentDetails)} />
    </InternalPage>
  );
}
