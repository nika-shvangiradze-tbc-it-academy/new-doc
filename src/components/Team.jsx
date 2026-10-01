import React from "react";
import { useTranslation } from "react-i18next";
import ServiceCard from "./ServiceCard";
import { IconUsers } from "./Icons";

export default function Team({ index }) {
  const { t } = useTranslation();

  return (
    <ServiceCard
      index={index}
      image="/images/tm.jpg"
      alt="Silhouettes of a team celebrating together on a mountain summit at sunset"
      icon={<IconUsers />}
      title={t("team_title")}
      description={t("team_description")}
      to="/service-details"
    />
  );
}
