import React from "react";
import { useTranslation } from "react-i18next";
import ServiceCard from "./ServiceCard";
import { IconStethoscope } from "./Icons";

export default function Prepare({ index }) {
  const { t } = useTranslation();

  return (
    <ServiceCard
      index={index}
      image="/images/exam-hooks.jpg"
      alt="Hand filling in an exam answer sheet with a pencil"
      icon={<IconStethoscope />}
      title={t("prepare_title")}
      description={t("prepare_description")}
      to="/service-information"
    />
  );
}
