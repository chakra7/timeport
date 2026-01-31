import type { Place, ApiPredictionResponse } from '@/types';

const API_URL = 'http://localhost:3000/api';

export async function fetchPrediction(place: Place, year: number): Promise<ApiPredictionResponse> {
  const response = await fetch(`${API_URL}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ place, year }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
}
