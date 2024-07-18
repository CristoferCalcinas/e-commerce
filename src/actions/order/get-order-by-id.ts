"use server";

import prisma from "@/lib/prisma";
import { middleware } from "@/auth.config";

export const getOrderById = async (id: string) => {
  const session = await middleware();
  if (!session?.user) {
    return {
      ok: false,
      message: "No hay sesion de usuario",
    };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        OrderAddress: true,
        OrderItem: {
          select: {
            quantity: true,
            price: true,
            size: true,

            product: {
              select: {
                title: true,
                slug: true,

                ProductImage: {
                  select: {
                    url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });
    if (!order) {
      throw new Error("No se encontro la orden");
    }

    if (session.user.role === "user") {
      if (session.user.id !== order.userId) {
        throw new Error("No tienes permisos para ver esta orden");
      }
    }
    return {
      ok: true,
      order: order,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudo obtener la orden",
    };
  }
};
