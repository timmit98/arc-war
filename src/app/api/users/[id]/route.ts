import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    let userProfile = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        displayname: true,
        profileimageurl: true,
      },
    })

    if (!userProfile) {
      userProfile = await prisma.user.create({
        data: {
          id: params.id,
          email: user.email,
        },
        select: {
          id: true,
          email: true,
          displayname: true,
          profileimageurl: true,
        },
      })
    }

    return NextResponse.json(userProfile)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.id !== params.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { displayname, profileimageurl } = body

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        displayname,
        profileimageurl,
      },
      select: {
        id: true,
        email: true,
        displayname: true,
        profileimageurl: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 