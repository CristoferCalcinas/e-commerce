import { Sidebar, TopMenu } from "@/components";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-blue-500">
      <TopMenu />
      <Sidebar />
      <div className="px-3 sm:px-7">{children}</div>
    </main>
  );
}
