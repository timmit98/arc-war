import { login } from '@/app/login/actions'
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className='bg-storm-grey-dark flex'>
        <div className='bg-storm-grey-dark min-h-screen flex flex-col w-[40%]'>
          <h1 className="text-text-light text-4xl ml-16 mt-12 text-left font-bold font-mono">Join the Party!</h1>
            <form className='flex items-center justify-center flex-1'>
              <div className="sm:shadow-xl items-center px-8 pb-8 pt-12 sm:bg-darkblue rounded-xl space-y-12 my-auto min-w-md">
                <h1 className="text-text-light text-4xl text-center font-bold font-mono">Login or Join up</h1>
                <div className='flex flex-col gap-4'>
                  <label className='text-text-light' htmlFor="email">Email:</label>
                  <input className="border-2 text-storm-grey-dark border-gray-300 rounded-md p-2" id="email" name="email" type="email" required/>
                  <label className='text-text-light' htmlFor="password">Password:</label>
                  <input className="border-2 text-text-light border-gray-300 rounded-md p-2" id="password" name="password" type="password" required/>
                  <button className='bg-lightblue text-text-light rounded-md p-2' formAction={login}>Log in</button>
                  <p className='text-text-light'> New here? <Link className='font-medium text-lightblue hover:underline' href="/signup">Sign up</Link></p>
                </div>  
              </div>
            </form>    
        </div>
        <div className='relative min-h-screen w-[65%]'>
          <img
            src="/background.png"
            alt="Background image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
    </div>
  )
}