import { login } from '@/app/login/actions'
import Image from "next/image";
import Link from 'next/link';
import { signup } from './action';

export default function SignUpPage() {
  return (
    <div className='bg-sunset grid grid-cols-2'>
        <div className='bg-sunset min-h-screen flex flex-col'>
          <h1 className="text-darkblue text-4xl ml-16 mt-12 text-left font-bold font-mono">Lets get you signed up!</h1>
            <form action={signup} className='flex items-center justify-center flex-1'>
              <div className="sm:shadow-xl items-center px-8 pb-8 pt-12 sm:bg-darkblue rounded-xl space-y-12 my-auto w-md">
                <h1 className="text-sunset text-4xl text-center font-bold font-mono">All we need to get started with!</h1>
                <div className='flex flex-col gap-4'>
                  <label className='text-sunset' htmlFor="email">Email:</label>
                  <input className="border-2 text-sunset border-gray-300 rounded-md p-2" id="email" name="email" type="email" required/>
                  <label className='text-sunset' htmlFor="displayName">Display Name:</label>
                  <input className="border-2 text-sunset border-gray-300 rounded-md p-2" id="displayName" name="displayName" type="text" required/>
                  <label className='text-sunset' htmlFor="password">Password:</label>
                  <input className="border-2 text-sunset border-gray-300 rounded-md p-2" id="password" name="password" type="password" required/>
                  <label className='text-sunset' htmlFor="confirmPassword">Confirm Password:</label>
                  <input className="border-2 text-sunset border-gray-300 rounded-md p-2" id="confirmPassword" name="confirmPassword" type="password" required/>
                  <button className='bg-lightblue text-sunset rounded-md p-2' type="submit">Sign Up</button>
                </div>  
              </div>
            </form>    
        </div>
        <div className='relative min-h-screen w-full'>
            <Image
            src="/deep-3PgouLtWJts-unsplash.svg"
            className="absolute inset-0 object-cover h-screen"
            alt="arc-war-background"
            priority
            fill
            /> 
        </div>
    </div>
  )
}