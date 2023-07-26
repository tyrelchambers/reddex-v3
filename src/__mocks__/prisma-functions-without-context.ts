import { prisma } from "~/server/db";

interface CreateUser {
  name: string;
  email: string;
  acceptTermsAndConditions: boolean;
}

export async function createUser(user: CreateUser) {
  if (user.acceptTermsAndConditions) {
    return await prisma.user.create({
      data: user,
    });
  } else {
    return new Error("User must accept terms!");
  }
}
