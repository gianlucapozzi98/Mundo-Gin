import { Metadata } from "next";
import { AdminClient } from "./AdminClient";

export const metadata: Metadata = {
  title: "Admin | Mundo Club",
  description: "Area staff per gestire iscritti e ingressi Mundo Club.",
  robots: { index: false, follow: false },
};

export default function ClubAdminPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F2] pt-24 sm:pt-28">
      <div className="container mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <AdminClient eventSlug="mundo-castel" />
      </div>
    </div>
  );
}
