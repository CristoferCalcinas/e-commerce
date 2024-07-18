"use server";

import prisma from "@/lib/prisma";

export const setTransactionId = async (
  ordenId: string,
  transactionId: string
) => {
  try {
    const order = await prisma.order.update({
      where: { id: ordenId },
      data: { transactionId: transactionId },
    });

    if (!order) {
      return {
        ok: false,
        message: `No se encontro una orden con el id: ${ordenId} `,
      };
    }

    return {
      ok: true,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: "No se pudo actualizar la orden",
    };
  }
};
