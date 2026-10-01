export const PHONE_DISPLAY = "+49 176 37376468";
export const PHONE_HREF = "tel:+4917637376468";

export function externalLinkProps(href) {
  return href.startsWith("http")
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
}

export const CONTACT_CHANNELS = [
  {
    name: "WhatsApp",
    icon: "/images/opt/whatsapp.png",
    href: "https://wa.me/4917637376468",
  },
  {
    name: "Viber",
    icon: "/images/opt/viber.png",
    href: "viber://chat?number=%2B4917637376468",
    round: true,
  },
  {
    name: "Telegram",
    icon: "/images/opt/telegram.png",
    href: "https://t.me/+4917637376468",
  },
];
