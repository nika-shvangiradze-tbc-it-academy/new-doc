import React from "react";
import { useTranslation } from "react-i18next";
import ServiceCard from "./ServiceCard";
import { IconListChecks } from "./Icons";

export default function Documentation({ index }) {
  const { t } = useTranslation();

  return (
    <ServiceCard
      index={index}
      image="/images/document-2.jpg"
      alt="Official forms and a notebook laid out on a white desk"
      icon={<IconListChecks />}
      title={t("documentation_title")}
      description={t("documentation_description")}
      to="/service-prepare"
    />
  );
}
