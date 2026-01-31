import { useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import { parseTime, formatYear } from '../utils/parseTime';
import { parsePlace } from '../utils/parsePlace';
import { getEra } from '../utils/parseTime';
import { fetchPrediction } from '../services/api';
import { generateData } from '../utils/dataGenerator';
import type { TimeMachineProps, JourneyData } from '@/types';

export function TimeMachine({ onTravel, isLoading = false }: TimeMachineProps): ReactElement {
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(isLoading);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Try to extract time and place from input
      const words = input.split(/\s+/);
      let timeIndex = -1;
      
      // Simple heuristic: look for time indicators
      const timeIndicators = ['bc', 'bce', 'ad', 'ce', 'year', 'ago', 'future'];
      
      words.forEach((word, index) => {
        if (timeIndicators.some(ind => word.toLowerCase().includes(ind)) || /^\d+$/.test(word)) {
          timeIndex = index;
        }
      });
      
      if (timeIndex >= 0) {
        // Assume time is at the end or after place
        const year = parseTime(input);
        if (year !== null) {
          // Extract place (everything before the time indicators)
          const placePart = words.slice(0, timeIndex).join(' ') || 'Unknown Location';
          
          const place = parsePlace(placePart);
          const era = getEra(year);
          
          let data;
          let context: string | undefined;
          
          try {
            // Try to fetch from API
            const apiResponse = await fetchPrediction(place, year);
            data = {
              weather: apiResponse.weather,
              language: apiResponse.language,
              population: apiResponse.population,
              lifeExpectancy: apiResponse.lifeExpectancy
            };
            context = apiResponse.context;
          } catch (apiError) {
            console.warn('API call failed, falling back to local generation:', apiError);
            // Fallback to local generation
            data = generateData(year, place);
          }
          
          const journeyData: JourneyData = {
            year,
            place,
            data,
            era,
            formattedYear: formatYear(year),
            context
          };
          
          onTravel(journeyData);
          return;
        }
      }
      
      setError('Could not parse time. Try formats like: "Paris 500 BC", "Tokyo 3000 AD", "London 100 years ago"');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🕰️ TimeTravel</h1>
      <p style={styles.subtitle}>Enter a place and time to begin your journey</p>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g., Ancient Rome 100 BC, Tokyo 3000 AD"
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Traveling...' : 'Travel'}
        </button>
      </form>
      
      {error && <p style={styles.error}>{error}</p>}
      
      <div style={styles.examples}>
        <p style={styles.examplesTitle}>Try these:</p>
        <div style={styles.exampleList}>
          <span style={styles.example} onClick={() => !loading && setInput('Athens 400 BC')}>Athens 400 BC</span>
          <span style={styles.example} onClick={() => !loading && setInput('London 1850 AD')}>London 1850</span>
          <span style={styles.example} onClick={() => !loading && setInput('Tokyo 3000 AD')}>Tokyo 3000</span>
          <span style={styles.example} onClick={() => !loading && setInput('Cairo 5000 years ago')}>Cairo 5000 years ago</span>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '10px',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '1.2rem',
    marginBottom: '30px',
    opacity: 0.8,
  },
  form: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },
  input: {
    padding: '15px 20px',
    fontSize: '1.1rem',
    border: '2px solid #4a90e2',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    color: '#ffffff',
    width: '100%',
    maxWidth: '400px',
    outline: 'none',
  },
  button: {
    padding: '15px 30px',
    fontSize: '1.1rem',
    backgroundColor: '#4a90e2',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  error: {
    color: '#ff6b6b',
    marginTop: '10px',
  },
  examples: {
    marginTop: '40px',
  },
  examplesTitle: {
    marginBottom: '10px',
    opacity: 0.7,
  },
  exampleList: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  example: {
    padding: '8px 15px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.2s',
  },
};
