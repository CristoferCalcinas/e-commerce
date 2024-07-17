"use server";

import prisma from "@/lib/prisma";

export const deleteUserAddress = async (id: string) => {
  try {
    const deleted = await prisma.userAddress.delete({ where: { userId: id } });
    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "Error al eliminar la dirección",
    };
  }
};
