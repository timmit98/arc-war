import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { name: string } }
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set: () => {},
        remove: () => {},
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const campaign = await prisma.campaign.findFirst({
      where: {
        name: params.name,
        userCampaigns: {
          some: {
            userId: user.id,
            role: 'DM' // Only DMs can create missions
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found or unauthorized' }, { status: 404 });
    }

    const { name, description, scheduledFor } = await req.json();

    const mission = await prisma.mission.create({
      data: {
        name,
        description,
        campaignId: campaign.id,
        createdById: user.id
      }
    });

    return NextResponse.json({ mission }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create mission' }, { status: 500 });
  }
} 