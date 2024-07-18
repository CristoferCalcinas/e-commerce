"use server";

import { middleware } from "@/auth.config";
import type { Address, Size } from "@/interfaces";
import prisma from "@/lib/prisma";

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await middleware();
  const userId = session?.user.id;
  // #Verificar si hay una sesion de usuario
  if (!userId) {
    return {
      ok: false,
      message: "No hay sesion de usuario",
    };
  }
  try {
    // #Obtener los productos
    const products = await prisma.product.findMany({
      where: { id: { in: productIds.map((p) => p.productId) } },
    });
    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);
    const { subTotal, tax, total } = productIds.reduce(
      (totals, item) => {
        const productQuantity = item.quantity;
        const product = products.find(
          (product) => product.id === item.productId
        );
        if (!product) throw new Error(`${item.productId} no existe - 500`);
        const subTotal = product.price * productQuantity;
        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;
        return totals;
      },
      { subTotal: 0, tax: 0, total: 0 }
    );

    // !Crear la transaccion de la orden
    const prismaTx = await prisma.$transaction(async (tx) => {
      // 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        // Acumular los valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((count, p) => count + p.quantity, 0);

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`);
        }
        return tx.product.update({
          where: { id: product.id },
          data: {
            inStock: {
              decrement: productQuantity,
            },
          },
        });
      });

      const updatedProducts = await Promise.all(updatedProductsPromises);
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(
            `No hay suficiente stock para el producto ${product.title}`
          );
        }
      });

      // 2. Crear la orden - encabezado - Detalle
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                quantity: p.quantity,
                size: p.size,
                productId: p.productId,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      });
      // Validar, si el price es cero, entonces, lanzar un error
      if (order.total === 0) {
        console.log({ order });
        throw new Error("El total de la orden es 0");
      }

      // 3. Crear la direccion de la orden
      const orderAddress = await tx.orderAddress.create({
        data: {
          orderId: order.id,
          countryId: address.country,
          address: address.address,
          city: address.city,
          firstName: address.firstName,
          lastName: address.lastName,
          phone: address.phone,
          postalCode: address.postalCode,
          address2: address.address2 ?? "",
        },
      });
      return {
        orden: order,
      };
    });
    return {
      ok: true,
      message: "Orden creada",
      order: prismaTx.orden,
    };
  } catch (error: any) {
    console.log(error);
    return {
      ok: false,
      message: error?.message,
    };
  }
};
