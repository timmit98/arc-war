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
    <div className='bg-storm-grey-dark'>
      <Header />
        <form onSubmit={handleCreateCampaign} className='bg-storm-grey-dark p-8 rounded-lg'>
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Campaigns</h2>
            <div className="space-y-4">
              {campaigns?.map(campaign => (
                <Link 
                  key={campaign.id} 
                  href={`/campaigns/${encodeURIComponent(campaign.name)}`}
                  className="block p-4 border rounded-lg shadow hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium">{campaign.name}</h3>
                  {campaign.description && (
                    <p className="text-sm text-gray-600">{campaign.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <h1 className='text-2xl font-bold mt-8'>Create a new campaign</h1>
          <div className='mt-4'>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700'>
              Name
            </label>
            <input
              type='text'
              id='name'
              required
              minLength={1}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`mt-4 w-full bg-indigo-600 py-2 px-4 text-sm font-medium text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </button>
        </form>
    </div>
  )
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