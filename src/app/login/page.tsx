'use client'

import { login } from '@/app/login/actions'
import Link from 'next/link';
import { useState } from 'react';
import Spinner from '@/components/loadingSpinner';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      await login(formData);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-storm-grey-dark flex flex-col md:flex-row'>
        <div className='bg-storm-grey-dark min-h-screen flex flex-col w-full md:w-[40%]'>
          <h1 className="text-text-light text-4xl ml-16 mt-12 text-left font-bold font-mono">Join the Party!</h1>
            <form onSubmit={handleSubmit} className='flex items-center justify-center flex-1'>
              <div className="sm:shadow-xl items-center px-8 pb-8 pt-12 sm:bg-darkblue rounded-xl space-y-12 my-auto min-w-md">
                <h1 className="text-text-light text-4xl text-center font-bold font-mono">Login</h1>
                <div className='flex flex-col gap-4'>
                  <label className='text-text-light' htmlFor="email">Email:</label>
                  <input className="border-2 text-text-light border-gray-300 rounded-md p-2" id="email" name="email" type="email" required/>
                  <label className='text-text-light' htmlFor="password">Password:</label>
                  <input className="border-2 text-text-light border-gray-300 rounded-md p-2" id="password" name="password" type="password" required/>
                  <button 
                    className='bg-lightblue text-text-light rounded-md p-2 flex items-center justify-center'
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : "Log in"}
                  </button>
                  <p className='text-text-light'> New here? <Link className='font-medium text-lightblue hover:underline' href="/signup">Sign up</Link></p>
                </div>  
              </div>
            </form>    
        </div>
        <div className='relative min-h-screen md:w-[65%]'>
          <img
            src="/background.png"
            alt="Background image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
    </div>
  )
}