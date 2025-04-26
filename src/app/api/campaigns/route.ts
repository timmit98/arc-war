import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
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
    const campaigns = await prisma.campaign.findMany({
      where: {
        userCampaigns: {
          some: {
            userId: user.id
          }
        }
      }
    });

    return NextResponse.json({ campaigns });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
} 