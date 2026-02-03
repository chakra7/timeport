'use client';

import { useState, useEffect } from 'react';
import { TimeMachine } from '@/components/TimeMachine';
import { EraDisplay } from '@/components/EraDisplay';
import { fetchVisualization } from '@/services/api';
import type { JourneyData } from '@/types';

export default function Home() {
  const [journey, setJourney] = useState<JourneyData | null>(null);

  const handleTravel = (journeyData: JourneyData): void => {
    setJourney(journeyData);
    
    // Fetch visualization in the background if not already provided
    if (!journeyData.imageUrls || journeyData.imageUrls.length === 0) {
      const prompt = `${journeyData.place.name} in the year ${journeyData.year}. ${journeyData.context || ''}`;
      fetchVisualization(prompt)
        .then(res => {
          setJourney(prev => {
            if (prev && prev.year === journeyData.year && prev.place.name === journeyData.place.name) {
              return { 
                ...prev, 
                imageUrls: res.imageUrls,
                imageUrl: res.imageUrls[0] // Set first image as default background
              };
            }
            return prev;
          });
        })
        .catch(err => console.error('Delayed visualization error:', err));
    }
  };

  const handleReset = (): void => {
    setJourney(null);
  };

  return (
    <main className="min-h-screen">
      {journey ? (
        <EraDisplay journey={journey} onReset={handleReset} />
      ) : (
        <div className="min-h-screen flex items-center justify-center bg-[#1e3a5f] bg-gradient-to-br from-[#1e3a5f] to-[#0d1f2d]">
          <TimeMachine onTravel={handleTravel} />
        </div>
      )}
    </main>
  );
}
