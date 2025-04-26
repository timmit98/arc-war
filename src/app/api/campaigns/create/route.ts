import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = req.headers.get('cookie')?.split(';').find(c => c.trim().startsWith(`${name}=`));
          return cookie ? cookie.split('=')[1] : undefined;
        },
        set: () => {}, // Not needed for API routes
        remove: () => {}, // Not needed for API routes
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // First, ensure the user exists in our database
    const dbUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {}, // No updates needed if user exists
      create: {
        id: user.id,
        email: user.email || null,
      },
    });

    const { name, description } = await req.json();

    const campaign = await prisma.campaign.create({
      data: {
        name,
        description,
        createdById: dbUser.id,
        userCampaigns: {
          create: {
            userId: dbUser.id,
            role: 'DM',
          }
        }
      }
    });

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 });
  }
} 