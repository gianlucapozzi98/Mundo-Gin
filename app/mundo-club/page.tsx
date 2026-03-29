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
      <section
        className="flex min-h-screen flex-col items-center justify-center px-4 py-20"
        aria-label="Prossimamente"
      >
        <p
          className="text-center font-futura-500 font-medium uppercase tracking-[0.2em] text-mundo-black"
          style={{ fontSize: "clamp(31px, 10vw, 91px)", lineHeight: 1.05 }}
        >
          Coming Soon
        </p>
      </section>
    </div>
  );
}
