// lib/queries/getUserCampaigns.ts
import { prisma } from '@/lib/prisma';

export async function getUserCampaigns(userId: string) {
  return prisma.campaign.findMany({
    where: {
      userCampaigns: {
        some: {
          userId,
        },
      },
    },
    include: {
      userCampaigns: true,
    },
  });
}
