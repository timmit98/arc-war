import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { name: string; missionId: string } }
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
    const mission = await prisma.mission.findFirst({
      where: {
        id: params.missionId,
        campaign: {
          name: params.name,
          userCampaigns: {
            some: {
              userId: user.id
            }
          }
        }
      },
      include: {
        campaign: {
          select: {
            name: true
          }
        },
        interests: {
          select: {
            status: true,
            user: {
              select: {
                id: true,
                email: true,
                displayname: true
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
                displayname: true
              }
            }
          }
        }
      }
    });

    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
    }

    // Count interested and committed players
    const interestedCount = mission.interests.filter(i => i.status === 'INTERESTED').length;
    const committedCount = mission.interests.filter(i => i.status === 'COMMITTED').length;
    const signedUpCount = mission.signups.length;

    return NextResponse.json({ 
      mission,
      counts: {
        interested: interestedCount,
        committed: committedCount,
        signedUp: signedUpCount
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
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch mission' }, { status: 500 });
  }
} 