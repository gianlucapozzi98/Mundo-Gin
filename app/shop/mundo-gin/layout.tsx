import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mundo Gin | Italian Coffee Dry Gin in vendita",
  description:
    "Compra Mundo Gin: London Dry italiano distillato con caffè. Bottiglia 70 cl, gusto unico. Ordina online.",
};

export default function MundoGinProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
