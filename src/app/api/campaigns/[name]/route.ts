import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { name: string } }
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = request.headers.get('cookie')?.split(';').find(c => c.trim().startsWith(`${name}=`));
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
            userId: user.id
          }
        }
      },
      include: {
        missions: {
          include: {
            interests: {
              select: {
                status: true,
                user: {
                  select: {
                    id: true,
                    email: true,
                    displayname: true,
                    profileimageurl: true
                  }
                }
              }
            },
            signups: {
              select: {
                user: {
                  select: {
                    id: true,
                    email: true,
                    displayname: true,
                    profileimageurl: true
                  }
                }
              }
            }
          }
        },
        userCampaigns: {
          select: {
            role: true
          }
        }
      }
    });

    if (!campaign) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
    }

    // Process missions to include player counts and lists
    const missions = campaign.missions.map(mission => ({
      ...mission,
      counts: {
        interested: mission.interests.filter(i => i.status === 'INTERESTED').length,
        committed: mission.interests.filter(i => i.status === 'COMMITTED').length,
        signedUp: mission.signups.length
      },
      players: {
        interested: mission.interests
          .filter(i => i.status === 'INTERESTED')
          .map(i => i.user),
        committed: mission.interests
          .filter(i => i.status === 'COMMITTED')
          .map(i => i.user),
        signedUp: mission.signups.map(s => s.user)
      }
    }));

    return NextResponse.json({ 
      campaign: {
        ...campaign,
        missions
      }
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
  }
} 