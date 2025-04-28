'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  email: string;
  displayname?: string;
  profileimageurl?: string;
}

interface Mission {
  id: string;
  name: string;
  description?: string;
  reward?: string;
  counts: {
    interested: number;
    committed: number;
    signedUp: number;
  };
  players: {
    interested: User[];
    committed: User[];
    signedUp: User[];
  };
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  missions: Mission[];
  userCampaigns: {
    role: string;
  }[];
}

export default function CampaignPage() {
  const params = useParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMissionForm, setShowMissionForm] = useState(false);
  const [newMission, setNewMission] = useState({
    name: '',
    description: '',
    reward: '',
  });

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${params.name}`);
        const data = await res.json();
        console.log(data);
        setCampaign(data.campaign);
      } catch (err) {
        console.error('Failed to fetch campaign:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [params.name]);

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/campaigns/${params.name}/missions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMission),
      });

      if (!res.ok) {
        throw new Error('Failed to create mission');
      }

      const updatedRes = await fetch(`/api/campaigns/${params.name}`);
      const updatedData = await updatedRes.json();
      setCampaign(updatedData.campaign);
      
      setNewMission({ name: '', description: '', reward: '' });
      setShowMissionForm(false);
    } catch (err) {
      console.error('Failed to create mission:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!campaign) return <div>Campaign not found</div>;

  const isDM = campaign.userCampaigns?.some(uc => uc.role === 'DM');

  return (
    <div className='bg-storm-grey-dark h-screen'>
      <div className="p-8">
        <h1 className="text-3xl text-text-light font-bold mb-4">{campaign.name}</h1>
        {campaign.description && (
          <p className="text-text-light mb-8">{campaign.description}</p>
        )}
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl text-text-light font-semibold">Missions</h2>
            {isDM && (
              <button 
                onClick={() => setShowMissionForm(!showMissionForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {showMissionForm ? 'Cancel' : 'Add a Mission'}
              </button>
            )}
          </div>

          {showMissionForm && (
            <form onSubmit={handleCreateMission} className="p-4 border rounded-lg space-y-4">
              <div>
                <label htmlFor="missionName" className="block text-sm font-medium text-text-light">
                  Mission Name
                </label>
                <input
                  type="text"
                  id="missionName"
                  value={newMission.name}
                  onChange={(e) => setNewMission({ ...newMission, name: e.target.value })}
                  className="mt-1 block w-full rounded-md text-text-light border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="missionDescription" className="block text-sm font-medium text-text-light">
                  Description
                </label>
                <textarea
                  id="missionDescription"
                  value={newMission.description}
                  onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                  className="mt-1 block w-full text-text-lightrounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="missionReward" className="block text-sm font-medium text-gray-700">
                  Mission Reward
                </label>
                <input
                  type="text"
                  id="missionReward"
                  value={newMission.reward}
                  onChange={(e) => setNewMission({ ...newMission, reward: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />  
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 py-2 px-4 text-sm font-medium text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Mission
              </button>
            </form>
          )}

          {campaign.missions.map(mission => (
            <Link 
              key={mission.id} 
              href={`/campaigns/${params.name}/missions/${mission.id}`}
              className="block p-4 border rounded-lg shadow hover:bg-darkblue transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-text-light">{mission.name}</h3>
                  {mission.description && (
                    <p className="text-sm text-text-light">{mission.description}</p>
                  )}
                </div>
                <div className="flex -space-x-2">
                  {mission.players.committed.map(player => (
                    <div key={player.id} className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                      {player.profileimageurl ? (
                        <Image
                          src={player.profileimageurl}
                          alt={player.displayname || player.email}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-text-light">
                            {(player.displayname || player.email)[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  {mission.players.interested.map(player => (
                    <div key={player.id} className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-white">
                      {player.profileimageurl ? (
                        <Image
                          src={player.profileimageurl}
                          alt={player.displayname || player.email}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {(player.displayname || player.email)[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2 text-sm text-text-light">
                {mission.counts.committed} committed • {mission.counts.interested} interested
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 