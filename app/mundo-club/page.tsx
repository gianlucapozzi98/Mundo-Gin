import { Metadata } from "next";
import { MundoClubCollage } from "./MundoClubCollage";

export const metadata: Metadata = {
  title: "Mundo Club | Mundo Gin",
  description: "Unisciti al Mundo Club.",
};

export default function MundoClubPage() {
  return (
    <div className="bg-[#F2F2F2]">
      <MundoClubCollage />
    </div>
  );
}
