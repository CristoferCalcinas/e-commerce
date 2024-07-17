import { middleware } from "@/auth.config";
import { redirect } from "next/navigation";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await middleware();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return <>{children}</>;
}
