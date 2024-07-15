import { ProductGrid, Title } from "@/components";
import { Category } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: Category;
  };
}

export default function CategoryPage({ params }: Props) {
  const { id } = params;
  // if (id === "kids") {
  //   notFound();
  // }

  const lables: Record<Category, string> = {
    men: "para Hombres",
    women: "para Mujeres",
    kid: "para Niños",
    unisex: "para Todos",
  };

  const products = initialData.products.filter(
    (product) => product.gender === id
  );

  return (
    <>
      <Title
        title={`Articulos de ${lables[id]}`}
        subtitle="Todos los productos"
      />
      <ProductGrid products={products} />
    </>
  );
}
