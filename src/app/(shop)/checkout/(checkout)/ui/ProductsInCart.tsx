"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useCartStore } from "@/store";
import { currencyFormat } from "@/utils";
// import { redirect } from "next/navigation";

export const ProductsInCart = () => {
  const [loaded, setLoaded] = useState(false);

  const productsInCart = useCartStore((state) => state.cart);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  // if (productsInCart.length === 0) {
  //   redirect("/cart");
  // }

  return (
    <div>
      {productsInCart.map((product) => (
        <div key={`${product.slug}-${product.size}`} className="flex mb-5">
          <Image
            src={`/products/${product.image}`}
            alt={product.title}
            width={100}
            height={100}
            className="mr-5 rounded w-[100px] h-[100px]"
          />
          <div>
            <span>
              {product.size} - {product.title} ({product.quantity})
            </span>

            <p className="font-bold">
              {currencyFormat(product.price + product.quantity)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
