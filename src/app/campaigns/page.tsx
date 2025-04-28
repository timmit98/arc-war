'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/header';

interface Campaign {
  id: string;
  name: string;
  description?: string;
}

export default function CampaingsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns);
    };
    fetchCampaigns();
  }, []);

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const name = nameInput.value.trim();

    if (!name) {
      setError('Campaign name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      await createCampaign(name);
      // Clear the input and refresh the campaigns list
      nameInput.value = '';
      const res = await fetch('/api/campaigns');
      const data = await res.json();
      setCampaigns(data.campaigns);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-storm-grey-dark h-full'>
      <div className='flex flex-col lg:flex-row h-screen'>
        <div className='w-full lg:w-[40%] p-8'>
          <form onSubmit={handleCreateCampaign} className='bg-storm-grey-dark rounded-lg'>
            <div>
              <h2 className="text-xl text-text-light font-semibold mb-4">Your Campaigns</h2>
              <div className="space-y-4">
                {campaigns?.map(campaign => (
                  <Link 
                    key={campaign.id} 
                    href={`/campaigns/${encodeURIComponent(campaign.name)}`}
                    className="block p-4 border rounded-lg shadow hover:bg-darkblue transition-colors"
                  >
                    <h3 className="font-medium text-text-light">{campaign.name}</h3>
                    {campaign.description && (
                      <p className="text-sm text-text-light">{campaign.description}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
            <h1 className='text-2xl text-text-light font-bold mt-8'>Create a new campaign</h1>
            <div className='mt-4 flex flex-col lg:flex-row justify-between gap-8'>
              <div className='w-full lg:w-1/2'>
                <label htmlFor='name' className='block text-sm font-medium text-text-light'>
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  required
                  minLength={1}
                  className='mt-1 block w-full border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                />
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>
              <div className='w-full lg:w-1/2'>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-4 w-full bg-indigo-600 py-2 px-4 text-sm font-medium text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Creating...' : 'Create Campaign'}
                </button>
              </div> 
            </div>
          </form>
        </div>
        <div className='hidden lg:block lg:w-[65%] lg:min-h-screen bg-storm-grey-light relative h-full'>
          <img
            src="/background.png"
            alt="Background image"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

const createCampaign = async (name: string, description?: string) => {
  const res = await fetch('/api/campaigns/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to create campaign');
  }

  return res.json();
};