import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { ItemCard } from "@/components/ItemCard";
import { ItemForm } from "@/components/ItemForm";
import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("HomePage");
  const session = await auth();
  if (!session?.user?.id) return null;

  const items = await prisma.item.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("title")}</h1>
      <ItemForm />
      <ul className="space-y-2">
        {items.map((item) => <ItemCard key={item.id} item={item} />)}
      </ul>
    </main>
  );
}