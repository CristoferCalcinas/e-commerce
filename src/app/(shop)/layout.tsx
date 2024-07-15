import { Footer, Sidebar, TopMenu } from "@/components";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-blue-500">
      <TopMenu />
      <Sidebar />

      <div className="px-0 sm:px-3 md:px-7">{children}</div>

      <Footer />
    </main>
  );
}
