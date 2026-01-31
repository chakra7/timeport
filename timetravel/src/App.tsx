import { useState } from 'react';
import type { ReactElement } from 'react';
import { TimeMachine } from './components/TimeMachine';
import { EraDisplay } from './components/EraDisplay';
import type { JourneyData } from '@/types';
import './App.css';

function App(): ReactElement {
  const [journey, setJourney] = useState<JourneyData | null>(null);

  const handleTravel = (journeyData: JourneyData): void => {
    setJourney(journeyData);
  };

  const handleReset = (): void => {
    setJourney(null);
  };

  return (
    <div className="app">
      {journey ? (
        <EraDisplay journey={journey} onReset={handleReset} />
      ) : (
        <div className="landing">
          <TimeMachine onTravel={handleTravel} />
        </div>
      )}
    </div>
  );
}

export default App;
