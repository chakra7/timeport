import type { ReactElement } from 'react';
import { getTheme } from '@/lib/themes';
import { getEraName } from '@/lib/parseTime';
import type { EraDisplayProps, EraTheme } from '@/types';

export function EraDisplay({ journey, onReset }: EraDisplayProps): ReactElement | null {
  if (!journey) return null;

  const { year, place, data, era, formattedYear, context } = journey;
  const theme: EraTheme = getTheme(era);

  const containerStyle: React.CSSProperties = {
    backgroundColor: theme.bgColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    minHeight: '100vh',
    padding: '20px 10px',
    transition: 'all 0.8s ease',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: `2px solid ${theme.borderColor}`,
    borderRadius: '12px',
    padding: '15px',
    marginBottom: '10px',
    boxShadow: `0 4px 20px ${theme.accentColor}20`,
    width: '100%',
    margin: '0 0 10px',
  };

  const labelStyle: React.CSSProperties = {
    color: theme.accentColor,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '5px',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: '1.4',
  };

  // Use API context if available, otherwise fallback to generated description
  const contextText = context || getDefaultContext(year, place, data);

  return (
    <div style={containerStyle}>
      <div style={styles.header}>
        <span style={{ fontSize: '2.5rem' }}>{theme.icon}</span>
        <h1 style={{ ...styles.title, color: theme.accentColor }}>
          {getEraName(year)}
        </h1>
        <p style={styles.location}>
          {place.name}, {formattedYear}
        </p>
        <button 
          onClick={onReset} 
          style={{ 
            ...styles.resetButton, 
            borderColor: theme.accentColor, 
            color: theme.accentColor 
          }}
        >
          ← Travel Again
        </button>
      </div>

      <div style={cardStyle}>
        <div style={labelStyle}>Summary</div>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.5', opacity: 0.9 }}>
          {contextText}
        </p>
      </div>

      <div style={styles.list}>
        <div style={cardStyle}>
          <div style={labelStyle}>Current Weather</div>
          <div style={valueStyle}>{data.weather}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Language Spoken</div>
          <div style={valueStyle}>{data.language}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Population</div>
          <div style={valueStyle}>{data.population}</div>
        </div>

        <div style={cardStyle}>
          <div style={labelStyle}>Life Expectancy</div>
          <div style={valueStyle}>{data.lifeExpectancy}</div>
        </div>
      </div>
    </div>
  );
}

function getDefaultContext(year: number, place: { name: string; terrain: string }, data: { language: string }): string {
  return `You find yourself in ${place.name} during the ${year < 0 ? 'ancient past' : year > 2024 ? 'far future' : 'modern era'}. 
    The ${place.terrain} landscape stretches around you. 
    ${year < 0 
      ? `This is a time before modern civilization, where ${data.language.toLowerCase()} echoes through the air.` 
      : year > 2024 
        ? `You are in the future, where ${data.language.toLowerCase()} has evolved and technology has transformed the world.`
        : `You stand in the modern era, witnessing the hustle of contemporary life.`}`;
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '1.8rem',
    margin: '5px 0',
    transition: 'all 0.5s',
  },
  location: {
    fontSize: '1rem',
    opacity: 0.8,
    marginBottom: '10px',
  },
  resetButton: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    border: '2px solid',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    margin: '0',
  },
};
