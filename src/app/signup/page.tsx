import Image from "next/image";
import { signup } from './action';

export default function SignUpPage() {
  return (
    <div className='bg-storm-grey-dark flex'>
        <div className='bg-storm-grey-dark min-h-screen flex flex-col w-[40%]'>
          <h1 className="text-text-light text-4xl ml-16 mt-12 text-left font-bold font-mono">Lets get you signed up!</h1>
            <form action={signup} className='flex items-center justify-center flex-1'>
              <div className="sm:shadow-xl items-center px-8 pb-8 pt-12 sm:bg-darkblue rounded-xl space-y-12 my-auto w-md">
                <h1 className="text-text-light text-4xl text-center font-bold font-mono">All we need to get started with!</h1>
                <div className='flex flex-col gap-4'>
                  <label className='text-text-light' htmlFor="email">Email:</label>
                  <input className="border-2 text-text-light border-gray-300 rounded-md p-2" id="email" name="email" type="email" required/>
                  <label className='text-text-light' htmlFor="displayName">Display Name:</label>
                  <input className="border-2 text-text-light border-gray-300 rounded-md p-2" id="displayName" name="displayName" type="text" required/>
                  <label className='text-text-light' htmlFor="password">Password:</label>
                  <input className="border-2 text-text-light border-gray-300 rounded-md p-2" id="password" name="password" type="password" required/>
                  <label className='text-text-light' htmlFor="confirmPassword">Confirm Password:</label>
                  <input className="border-2 text-text-light border-gray-300 rounded-md p-2" id="confirmPassword" name="confirmPassword" type="password" required/>
                  <button className='bg-lightblue text-text-light rounded-md p-2' type="submit">Sign Up</button>
                </div>  
              </div>
            </form>    
        </div>
        <div className='relative min-h-screen w-[65%]'>
            <Image
            src="/background.png"
            className="absolute inset-0 object-cover h-screen"
            alt="arc-war-background"
            priority
            fill
            /> 
        </div>
    </div>
  )
}