import React, { useState } from "react"; // Import useState for local state
import { useTranslation } from "react-i18next";
import ServiceCard from "./ServiceCard";
import { IconInfo } from "./Icons";

export default function Information({ index }) {
  const [showMore] = useState(false); // Local state for this component
  const { t } = useTranslation();

  return (
    <ServiceCard
      index={index}
      image="/images/document.jpg"
      alt="Person signing official documents at a desk"
      icon={<IconInfo />}
      title={t("information_title")}
      description={t("information_description")}
      to="/service-documentation"
    >
      {showMore && (
        <div className="text-[#333333] mt-[20px] font-poppins text-[15px] font-medium md:text-[20px] ">
          <ul className="list-disc pl-[20px] leading-relaxed md:mt-[30px] lg:text-[12px] md:text-[13px]">
            <li>
              All foreign-language documents must
              be submitted as certified copies.
              These certified copies must be
              accompanied by original translations
              by a translator.
            </li>
            <li className="mt-2 leading-relaxed">
              All foreign documents must be
              presented with a Hague Apostille or
              be legalized by the German embassy
              in the issuing country. Information
              on legalization can be found at:
              <li className="ml-[20px]">
                <a
                  href="https://www.auswaertiges-amt.de/de/service/konsularinfo/internationaler-urkundenverkehr"
                  className="text-[#4836b8]"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.auswaertiges-amt.de/de/service/konsularinfo/internationaler-urkundenverkehr
                </a>
              </li>
            </li>
            <li className="mt-2 leading-relaxed">
              Certified copies of foreign-language
              documents are made directly from the
              original by the competent authority,
              with the date of issue and
              signature. Certified copies of
              original documents can be issued by:
              <ul className="ml-[30px] list-disc leading-relaxed">
                <li>
                  the Federal Republic of Germany
                  or another member state of the
                  European Union
                </li>
                <li>
                  German embassies/consulates
                </li>
              </ul>
            </li>
            <li className="mt-2 leading-relaxed">
              All foreign-language documents must
              be translated into German. The
              translation must be complete. The
              translation is only accepted from:
              <ul className="ml-[30px] list-disc mt-[20px]">
                <li>
                  a court-authorized person
                  (publicly appointed and sworn
                  translator) of the Federal
                  Republic of Germany or another
                  EU member state
                </li>
                <li className="mt-[10px]">
                  The translator must attach the
                  certified copy of the
                  foreign-language document
                  inseparably to the original
                  translation and confirm the
                  accuracy and completeness of the
                  translation.
                </li>
              </ul>
              <li className="ml-[30px] mt-[10px] leading-relaxed">
                The original translation will
                remain with the state examination
                office for health professions.
              </li>
            </li>
            <li className="mt-2 leading-relaxed">
              Collective copies, translations, and
              certifications are not accepted.
              Avoid plastic folders, binders, or
              similar for the documents.
            </li>
          </ul>
        </div>
      )}
    </ServiceCard>
  );
}
