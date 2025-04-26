'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/header';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  displayname?: string;
}

interface Mission {
  id: string;
  name: string;
  description?: string;
  reward?: string;
  campaignId: string;
  createdById: string;
  maxPlayers: number;
  campaign: {
    name: string;
  };
}

interface MissionData {
  mission: Mission;
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

export default function MissionPage() {
  const params = useParams<{ name: string; missionId: string }>();
  const [missionData, setMissionData] = useState<MissionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await fetch(`/api/campaigns/${params.name}/missions/${params.missionId}`);
        const data = await res.json();
        setMissionData(data);
      } catch (err) {
        console.error('Failed to fetch mission:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMission();
  }, [params.name, params.missionId]);

  if (loading) return <div>Loading...</div>;
  if (!missionData) return <div>Mission not found</div>;

  const { mission, counts, players } = missionData;

  return (
    <div className='bg-sunset'>
      <Header />
      <div className="p-8">
        <div className="mb-4">
          <Link 
            href={`/campaigns/${mission.campaign.name}`}
            className="text-blue-500 hover:text-blue-700"
          >
            Back to Campaign
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{mission.name}</h1>
          {mission.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{mission.description}</p>
            </div>
          )}
          {mission.reward && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Reward</h2>
              <p className="text-gray-700">{mission.reward}</p>
            </div>
          )}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Details</h2>
            <p className="text-gray-700">Maximum Players: {mission.maxPlayers}</p>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Players</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Committed ({counts.committed})</h3>
                <ul className="space-y-1">
                  {players.committed.map(player => (
                    <li key={player.id} className="text-sm">
                      {player.displayname || player.email}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Interested ({counts.interested})</h3>
                <ul className="space-y-1">
                  {players.interested.map(player => (
                    <li key={player.id} className="text-sm">
                      {player.displayname || player.email}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex space-x-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Commit ({counts.signedUp}/{mission.maxPlayers})
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Show Interest ({counts.interested})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 