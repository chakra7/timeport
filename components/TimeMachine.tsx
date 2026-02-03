'use client';

import { useState } from 'react';
import type { FormEvent, ReactElement, CSSProperties } from 'react';
import { parseTime, formatYear } from '@/lib/parseTime';
import { parsePlace } from '@/lib/parsePlace';
import { getEra } from '@/lib/parseTime';
import { fetchPrediction } from '@/services/api';
import { generateData } from '@/lib/dataGenerator';
import type { TimeMachineProps, JourneyData } from '@/types';

export function TimeMachine({ onTravel }: TimeMachineProps): ReactElement {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('Initiating jump...');

  const loadingMessages = [
    'Stabilizing temporal field...',
    'Scanning regional history...',
    'Synthesizing era data...',
    'Translating ancient languages...',
    'Finalizing destination arrival...'
  ];

  const handleTravelAction = async (destination: string) => {
    const trimmedInput = destination.trim();
    if (!trimmedInput || loading) return;
    
    console.log('--- TRAVEL SEQUENCE START ---');
    console.log('Target:', trimmedInput);
    
    setError('');
    setLoading(true);
    setLoadingMessage('Initiating jump...');
    
    // Message cycle
    let msgIndex = 0;
    const interval = setInterval(() => {
      setLoadingMessage(loadingMessages[msgIndex]);
      msgIndex = (msgIndex + 1) % loadingMessages.length;
    }, 2000);

    try {
      // 1. Determine Time
      const parsedYear = parseTime(trimmedInput);
      const year = parsedYear !== null ? parsedYear : new Date().getFullYear();
      
      // 2. Determine Place
      const words = trimmedInput.split(/\s+/);
      const timeIndicators = ['bc', 'bce', 'ad', 'ce', 'year', 'ago', 'future', 'now'];
      let timeIndex = -1;
      
      words.forEach((word, index) => {
        if (timeIndicators.some(ind => word.toLowerCase().includes(ind)) || /^\d+$/.test(word)) {
          timeIndex = index;
        }
      });
      
      let placePart = trimmedInput;
      if (timeIndex >= 0) {
        placePart = words.slice(0, timeIndex).join(' ');
        if (!placePart.trim()) placePart = words[0];
      }
      
      console.log('Resolution - Place:', placePart, 'Year:', year);
      
      const place = parsePlace(placePart);
      const era = getEra(year);
      
      // 3. Fetch Data
      let data;
      let context: string | undefined;
      let imageUrl: string | undefined;
      
      try {
        console.log('Fetching prediction from API...');
        const apiResponse = await fetchPrediction(place, year);
        data = {
          weather: apiResponse.weather,
          language: apiResponse.language,
          population: apiResponse.population,
          lifeExpectancy: apiResponse.lifeExpectancy
        };
        context = apiResponse.context;
        imageUrl = apiResponse.imageUrl;
        console.log('API Success');
      } catch (apiError) {
        console.warn('API fetch failed, falling back to local generator:', apiError);
        data = generateData(year, place);
      }
      
      const journeyData: JourneyData = {
        year,
        place,
        data,
        era,
        formattedYear: formatYear(year),
        context,
        imageUrl
      };
      
      console.log('--- TRAVEL SEQUENCE COMPLETE ---');
      onTravel(journeyData);
    } catch (err) {
      setError('Temporal instability detected. Please try a different destination.');
      console.error('Jump failure:', err);
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleTravelAction(input);
  };

  const handleExampleClick = (val: string) => {
    if (loading) return;
    setInput(val);
    handleTravelAction(val);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🕰️ TimeTravel</h1>
      <p style={styles.subtitle}>Specify coordinates to begin your journey</p>
      
      <form onSubmit={onSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Athens 400 BC, Tokyo 3000 AD"
          style={styles.input}
          disabled={loading}
          autoFocus
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? loadingMessage : 'Travel'}
        </button>
      </form>
      
      {error && <p style={styles.error}>{error}</p>}
      
      <div style={styles.examples}>
        <p style={styles.examplesTitle}>Jump points:</p>
        <div style={styles.exampleList}>
          {['Athens 400 BC', 'London 1850 AD', 'Tokyo 3000 AD', 'Sahara 10000 BC'].map(ex => (
            <span 
              key={ex} 
              style={styles.example} 
              onClick={() => handleExampleClick(ex)}
            >
              {ex}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  container: {
    textAlign: 'center',
    padding: '40px 20px',
    color: 'white',
    maxWidth: '800px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '3.5rem',
    marginBottom: '10px',
    fontWeight: 'bold',
    textShadow: '0 0 20px rgba(74, 144, 226, 0.5)',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '40px',
    opacity: 0.8,
  },
  form: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    maxWidth: '600px',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '18px 25px',
    fontSize: '1.1rem',
    border: '2px solid #4a90e2',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    outline: 'none',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)',
  },
  button: {
    width: '100%',
    padding: '18px 40px',
    fontSize: '1.1rem',
    backgroundColor: '#4a90e2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: 'bold',
    minHeight: '60px',
    transition: 'all 0.2s',
    boxShadow: '0 4px 15px rgba(74, 144, 226, 0.3)',
  },
  error: {
    color: '#ff6b6b',
    marginTop: '20px',
    fontSize: '1rem',
  },
  examples: {
    marginTop: '50px',
    width: '100%',
  },
  examplesTitle: {
    marginBottom: '15px',
    opacity: 0.6,
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
  },
  exampleList: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  example: {
    padding: '10px 20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
};
