"use server";

import { middleware } from "@/auth.config";
import prisma from "@/lib/prisma";

export const getPaginatedUsers = async () => {
  const session = await middleware();
  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "Debe de ser usuario administrador",
    };
  }

  const users = await prisma.user.findMany({
    orderBy: {
      name: "desc",
    },
  });
  return {
    ok: true,
    users: users,
  };
};
