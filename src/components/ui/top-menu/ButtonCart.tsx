"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCartStore } from "@/store";
import { IoCartOutline } from "react-icons/io5";

export const ButtonCart = () => {
  const totalItemsInCart = useCartStore((store) => store.getTotalItems());

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
  }, [totalItemsInCart]);

  return (
    <Link href={totalItemsInCart === 0 && isLoading ? "/empty" : "/cart"}>
      <div className="relative">
        {isLoading && totalItemsInCart > 0 && (
          <span className="fade-in absolute text-xs rounded-full px-1 font-bold -top-2 -right-2 bg-blue-700 text-white">
            {totalItemsInCart}
          </span>
        )}
        <IoCartOutline className="w-5 h-5" />
      </div>
    </Link>
  );
};
