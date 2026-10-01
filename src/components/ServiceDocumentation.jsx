import React from "react";
import { useTranslation } from "react-i18next";
import InternalPage from "./page/InternalPage";
import { DocList } from "./page/ContentBlocks";
import toItems from "./page/toItems";

export default function ServiceDocumentation() {
  const { t, i18n } = useTranslation();

  const documentDetails =
    i18n.language == "en"
      ? {
          1: {
            description: `All foreign-language documents must be submitted as certified copies. These
certified copies must be accompanied by original translations by a translator.
`,
          },
          2: {
            description: `All foreign documents must be presented with a Hague Apostille or be legalized by
the German embassy in the issuing country. Information on legalization can be found
at:`,
            title: `https://www.auswaertiges-amt.de/de/service/konsularinfo/internationaler-urkundenverkehr`,
          },

          3: {
            description: `Certified copies of foreign-language documents are made directly from the original
by the competent authority, with the date of issue and signature. Certified copies of
original documents can be issued by:`,
            title: `• the state examination office during office hours (appointment required), authorities or
notaries of the Federal Republic of Germany or another member state of the European
Union, German embassies/consulates.
`,
          },
          4: {
            description: ` the state examination office during office hours (appointment required), authorities or
notaries of the Federal Republic of Germany or another member state of the European
Union, German embassies/consulates.
`,

            title: `• a court-authorized person (publicly appointed and sworn translator) of the Federal
Republic of Germany or another EU member state, or a translator recognized by the German embassy/consulate. The translator must
attach the certified copy of the foreign-language document inseparably to the original
translation (e.g., by placing their seal on the connection points) and confirm the
accuracy and completeness of the translation. The original translation will remain with
the state examination office for health professions.`,
          },
          5: {
            description: `Collective copies, collective translations, and collective certifications are not
accepted. Please do not use plastic folders, binders, or similar for the documents.`,
          },
        }
      : i18n.language == "gr"
      ? {
          1: {
            description: `Alle fremdsprachigen Dokumente müssen als beglaubigte Kopien eingereicht werden. Diese
beglaubigten Kopien müssen Originalübersetzungen von einem Übersetzer beigefügt werden.
`,
          },
          2: {
            description: `Alle ausländischen Dokumente müssen mit einer Haager Apostille versehen sein oder von der deutschen Botschaft im Ausstellungsland legalisiert werden.
der deutschen Botschaft im Ausstellungsland legalisiert werden. Informationen zur Beglaubigung finden Sie
unter:`,
            title: `https://www.auswaertiges-amt.de/de/service/konsularinfo/internationaler-urkundenverkehr`,
          },

          3: {
            description: `Beglaubigte Kopien fremdsprachiger Dokumente werden direkt vom Original erstellt
von der zuständigen Behörde mit dem Datum der Ausstellung und der Unterschrift versehen. Beglaubigte Kopien von
Originaldokumenten können ausgestellt werden von:`,
            title: `• das Landesprüfungsamt während der Sprechzeiten (Termin erforderlich), Behörden oder
Notare der Bundesrepublik Deutschland oder eines anderen Mitgliedstaates der Europäischen Union
deutsche Botschaften/Konsulate.
`,
          },
          4: {
            description: ` das Landesprüfungsamt während der Sprechzeiten (Termin erforderlich), Behörden oder
Notare der Bundesrepublik Deutschland oder eines anderen Mitgliedstaates der Europäischen Union
deutsche Botschaften/Konsulate.
`,

            title: `• eine gerichtlich ermächtigte Person (öffentlich bestellter und beeidigter Übersetzer) aus der Bundesrepublik Deutschland
der Bundesrepublik Deutschland oder eines anderen EU-Mitgliedstaates oder ein von der deutschen Botschaft/Konsulat anerkannter Übersetzer. Der Übersetzer muss
die beglaubigte Kopie des fremdsprachlichen Dokuments untrennbar mit dem Original verbinden
untrennbar mit der Originalübersetzung verbinden (z.B. durch Anbringen seines Siegels an den Verbindungsstellen) und die
und die Richtigkeit und Vollständigkeit der Übersetzung bestätigen. Die Originalübersetzung verbleibt beim
dem Landesprüfungsamt für Gesundheitsberufe.`,
          },
          5: {
            description: `Sammelkopien, Sammelübersetzungen und Sammelbescheinigungen werden nicht
akzeptiert. Bitte verwenden Sie keine Plastikmappen, Ordner oder ähnliches für die Dokumente.`,
          },
        }
      : {
          1: {
            description: `ყველა უცხოური დოკუმენტი უნდა წარდგეს ნოტარიულად დამოწმებული
ასლების სახით, რომლებსაც უნდა დაერთოს მთარგმნელის მიერ
შესრულებული ორიგინალური თარგმანი.
`,
          },
          2: {
            description: `ყველა უცხოური დოკუმენტი, უნდა იყოს აღჭურვილი ჰააგის აპოსტილით
ან უნდა იყოს ლეგალიზებული გერმანიის საელჩოს მიერ.
დამატებითი ინფორმაცია ლეგალიზაციის შესახებ:`,
            title: `https://www.auswaertiges-amt.de/de/service/konsularinfo/internationaler-urkundenverkehr`,
          },

          3: {
            description: `უცხოური დოკუმენტების ნოტარიული ასლები მზადდება შესაბამისი
ორგანოს მიერ უშუალოდ დედნიდან, გაცემის თარიღისა და ხელმოწერის
მითითებით.
ნოტარიულად დამოწმებული დოკუმენტების ასლები მზადდება შემდეგი
ორგანოების მიერ:`,
            title: `• ფედერალური მიწის შემოწმების სახ. უწყების, სამუშაო საათებში (წინასწარი
შეხვედრის შეთანხმება აუცილებელია)
• გერმანიის ფედერაციული რესპუბლიკის ან ევროკავშირის სხვა წევრი
სახელმწიფოს სამთავრობო ორგანოების ან ნოტარიუსების მიერ,
• გერმანიის საელჩოები/გერმანიის საკონსულოები.
`,
          },
          4: {
            description: ` ყველა უცხოური დოკუმენტი უნდა ითარგმნოს გერმანულ ენაზე.
აუცილებელია, რომ მთარგმნელს ჰქონდეს დოკუმენტის დედანი ან მისი
ნოტარიული ასლი.
თარგმნა უნდა იყოს სრული. ბეჭდები, შტამპები, აპოსტილები, ლეგალიზაცია და
სხვა აღნიშვნები (საჭიროების შემთხვევაში, დოკუმენტის უკანა მხარეც უნდა
ითარგმნოს).
თარგმანი მიიღება მხოლოდ შემდეგი პირებისგან:
`,

            title: `• გერმანიის ფედერაციული რესპუბლიკის ან ევროკავშირის სხვა წევრი

სახელმწიფოს სასამართლოს მიერ უფლებამოსილი ან გერმანიის
საელჩოს/გერმანიის საკონსულოს მიერ აღიარებული მთარგმნელი.
მთარგმნელმა უნდა წარადგინოს ნოტარიული ასლი თარგმანთან ერთად და
ბეჭდით დაადასტუროს თარგმანის სიზუსტე და სრულყოფილება.
ორიგინალი თარგმანი დარჩება ჯანმრთელობის პროფესიული საგამოცდო
ოფისში.`,
          },
          5: {
            description: `კოლექტიური ასლები, თარგმანები და დამოწმებები არ მიიღება. თითოეული დოკუმენტი მოათავსეთ ცალკე ფაილში.`,
          },
        };

  return (
    <InternalPage
      variant="documents"
      title={t("inforamtion_h1")}
      image="/images/document.jpg"
      imageAlt="Person signing official documents at a desk"
      imagePosition="58% center"
    >
      <DocList items={toItems(documentDetails)} marker="number" />
    </InternalPage>
  );
}
