import { Metadata } from "next";
import { MundoClubCollage } from "./MundoClubCollage";
import { MundoClubEvents } from "./MundoClubEvents";

export const metadata: Metadata = {
  title: "Mundo Club | Mundo Gin",
  description: "Scopri gli eventi Mundo Club: tasting, serate cocktail e novità del mondo Mundo Gin.",
};

export default function MundoClubPage() {
  return (
    <div className="bg-[#F2F2F2]">
      <MundoClubCollage />
      <MundoClubEvents />
    </div>
  );
}
