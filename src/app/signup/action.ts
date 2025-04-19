'use server'

import { redirect } from 'next/navigation'
import { createClient } from '../../utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { prisma } from '../../lib/prisma'

export async function signup(formData: FormData) {
    const supabase = await createClient()
    
    // Extract all form fields
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const displayName = formData.get('displayName') as string

    // Create auth user with email and password
    const { data: authData, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: displayName
            }
        }
    })

    if (error) {
        console.error('Signup error:', error)
        redirect('/error')
    }

    if (authData?.user) {
        try {
            await prisma.user.create({
                data: {
                    id: authData.user.id,
                    email: email,
                    displayname: displayName
                }
            })
        } catch (error) {
            console.error('Error creating public user record:', error)
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

