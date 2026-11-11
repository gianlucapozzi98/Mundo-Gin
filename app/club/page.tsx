import { Metadata } from "next";
import { MundoClubCollage } from "./MundoClubCollage";
import { MundoClubEvents } from "./MundoClubEvents";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Mundo Club | Mundo Gin",
  description:
    "Scopri gli eventi Mundo Club: tasting, serate cocktail e novità del mondo Mundo Gin.",
  path: "/club",
});

export default function MundoClubPage() {
  return (
    <div className="bg-[#F2F2F2]">
      <MundoClubCollage />
      <MundoClubEvents />
    </div>
  );
}
