'use client'

import Image from "next/image";
import { useState } from "react";
import Spinner from "@/components/loadingSpinner";
import { signup } from "./action";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await signup(formData);
      alert(`An email has been sent to ${email}`);
    } catch (error) {
      console.error('Signup error:', error);
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-storm-grey-dark flex flex-col md:flex-row'>
        <div className='bg-storm-grey-dark min-h-screen flex flex-col w-full md:w-[40%]'>
          <h1 className="text-text-light text-4xl ml-4 md:ml-16 mt-12 text-left font-bold font-mono">Lets get you signed up!</h1>
            <form onSubmit={handleSubmit} className='flex items-center justify-center flex-1'>
              <div className="sm:shadow-xl items-center px-8 pb-8 pt-12 bg-darkblue rounded-xl space-y-12 my-auto w-full max-w-md mx-4">
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
                  {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                  )}
                  <button
                    className='bg-lightblue text-text-light rounded-md p-2 flex items-center justify-center'
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <Spinner /> : "Sign Up"}
                  </button>
                </div>  
              </div>
            </form>    
        </div>
        <div className='relative hidden md:block min-h-screen md:w-[65%]'>
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