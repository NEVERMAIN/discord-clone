import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export const currentProfile = async () => {
  const { userId } = auth();
  console.log("---->>currentProfile--userId=>",userId)
  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  });
  console.log("---->>currentProfile--profile=>",profile)

  return profile;
};
