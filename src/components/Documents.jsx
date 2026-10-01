import React from "react";
import { useTranslation } from "react-i18next";
import ServiceCard from "./ServiceCard";
import { IconFileCheck } from "./Icons";

export default function Documents({ index }) {
  const { t } = useTranslation();

  return (
    <ServiceCard
      index={index}
      image="/images/guidance.jpg"
      alt="Compass resting on a printed sheet of figures, symbolising guidance"
      icon={<IconFileCheck />}
      title={t("documents_title")}
      description={t("documents_description")}
      to="/service-documents"
    />
  );
}
