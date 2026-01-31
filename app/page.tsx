'use client';

import { useState } from 'react';
import { TimeMachine } from '@/components/TimeMachine';
import { EraDisplay } from '@/components/EraDisplay';
import type { JourneyData } from '@/types';

export default function Home() {
  const [journey, setJourney] = useState<JourneyData | null>(null);

  const handleTravel = (journeyData: JourneyData): void => {
    setJourney(journeyData);
  };

  const handleReset = (): void => {
    setJourney(null);
  };

  return (
    <main className="min-h-screen">
      {journey ? (
        <EraDisplay journey={journey} onReset={handleReset} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-slate-900">
          <TimeMachine onTravel={handleTravel} />
        </div>
      )}
    </main>
  );
}
