import { redirect } from "next/navigation";

/** Vecchio URL: redirect permanente a /club */
export default function MundoClubRedirectPage() {
  redirect("/club");
}
