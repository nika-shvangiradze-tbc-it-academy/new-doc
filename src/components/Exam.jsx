import React from "react";
import { useTranslation } from "react-i18next";
import ServiceCard from "./ServiceCard";
import { IconClipboard } from "./Icons";

export default function Exam({ index }) {
  const { t } = useTranslation();

  return (
    <ServiceCard
      index={index}
      image="/images/prepare.jpg"
      alt="Open notebook with a pen in front of a laptop on a desk"
      icon={<IconClipboard />}
      title={t("exam_title")}
      description={t("exam_description")}
      to="/service-exam"
    />
  );
}
