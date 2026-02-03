'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ReactElement, CSSProperties, MouseEvent } from 'react';
import { getTheme } from '@/lib/themes';
import { getEraName } from '@/lib/parseTime';
import type { EraDisplayProps, EraTheme, JourneyData } from '@/types';
import { TimeMachine } from '@/components/TimeMachine';

export function EraDisplay({ journey, onReset, onTravel }: EraDisplayProps): ReactElement | null {
  const [isUIVisible, setIsUIVisible] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [showTravelModal, setShowTravelModal] = useState(false);

  const theme: EraTheme = getTheme(journey?.era || 'modern');

  // Combine single imageUrl and imageUrls array if needed
  const allImages = journey?.imageUrls && journey.imageUrls.length > 0 ? journey.imageUrls : (journey?.imageUrl ? [journey.imageUrl] : []);
  const currentBackground = allImages[0] || journey?.imageUrl;

  const closeModal = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 200);
  }, [isClosing]);

  const closeTravelModal = useCallback(() => {
    setShowTravelModal(false);
  }, []);

  const handleNewTravel = useCallback((newJourney: JourneyData) => {
    setShowTravelModal(false);
    onTravel(newJourney);
  }, [onTravel]);

  const nextImage = useCallback(() => {
    if (allImages.length === 0) return;
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % allImages.length);
  }, [allImages.length]);

  const prevImage = useCallback(() => {
    if (allImages.length === 0) return;
    setActiveImageIndex((prevIndex) => (prevIndex - 1 + allImages.length) % allImages.length);
  }, [allImages.length]);

  // Keyboard navigation handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isModalOpen) {
        if (event.key === 'ArrowRight') {
          nextImage();
        } else if (event.key === 'ArrowLeft') {
          prevImage();
        } else if (event.key === 'Escape') {
          closeModal();
        }
      } else if (event.key === 'Escape') {
        // Close UI visibility if modal is not open
        setIsUIVisible(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, nextImage, prevImage, closeModal]);

  const stopPropagation = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);
  
  const handleBackgroundClick = useCallback(() => {
    if (isModalOpen) {
      closeModal();
    } else {
      setIsUIVisible(!isUIVisible);
    }
  }, [isModalOpen, isUIVisible, closeModal]);

  const selectImage = useCallback((e: MouseEvent, index: number) => {
    e.stopPropagation();
    setActiveImageIndex(index);
    setIsModalOpen(true); // Open modal on thumbnail click
    setIsUIVisible(true); // Ensure original contents are visible in the background
  }, []);

  if (!journey) return null;

  const { year, place, data, formattedYear, context } = journey;

  // Background layers: Base Theme Color -> Image -> Overlay
  const containerStyle: CSSProperties = {
    backgroundColor: theme.bgColor,
    backgroundImage: currentBackground ? `url(${currentBackground})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    minHeight: '100vh',
    width: '100%',
    position: 'relative',
    transition: 'background-image 0.8s ease-in-out, background-color 0.8s ease',
  };

  const overlayStyle: CSSProperties = {
    backgroundColor: isUIVisible ? 'rgba(10, 15, 24, 0.7)' : 'transparent',
    background: isUIVisible 
      ? `linear-gradient(to bottom, rgba(10, 15, 24, 0.9) 0%, rgba(10, 15, 24, 0.4) 50%, rgba(10, 15, 24, 0.9) 100%)`
      : 'transparent',
    minHeight: '100vh',
    width: '100%',
    padding: '40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backdropFilter: isUIVisible ? (currentBackground ? 'blur(8px)' : 'none') : 'none',
    transition: 'all 0.5s ease-in-out',
  };

  const contentStyle: CSSProperties = {
    opacity: isUIVisible ? 1 : 0,
    pointerEvents: isUIVisible ? 'auto' : 'none',
    transition: 'opacity 0.5s ease-in-out',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const cardStyle: CSSProperties = {
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    border: `1px solid rgba(56, 189, 248, 0.1)`,
    borderRadius: '24px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: `0 20px 50px rgba(0,0,0,0.3)`,
    width: '100%',
    maxWidth: '800px',
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  };

  const labelStyle: CSSProperties = {
    color: theme.accentColor,
    fontSize: '0.7rem',
    textTransform: 'uppercase',
    letterSpacing: '3px',
    marginBottom: '10px',
    fontWeight: 'bold',
    opacity: 0.9,
  };

  const valueStyle: CSSProperties = {
    fontSize: '1.1rem',
    fontWeight: 400,
    lineHeight: '1.6',
  };

  const contextText = context || getDefaultContext(year, place, data);

  return (
    <div style={containerStyle} onClick={handleBackgroundClick}>
      <div style={overlayStyle}>
        <div style={contentStyle}>
          <div style={styles.header} onClick={stopPropagation}>
            <div style={{ fontSize: '3.5rem', marginBottom: '15px' }}>{theme.icon}</div>
            <h1 style={{ ...styles.title, color: theme.accentColor }}>
              {getEraName(year)}
            </h1>
            <p style={styles.location}>
              {place.name}, {formattedYear}
            </p>
            
            {(!allImages || allImages.length === 0) && (
              <div style={styles.generatingBadge}>
                <span className="animate-pulse" style={{ color: theme.accentColor }}>
                  🔭 Visualizing timeline...
                </span>
              </div>
            )}

            <div style={styles.buttonContainer}>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onReset();
                }} 
                style={{ 
                  ...styles.resetButton, 
                  borderColor: theme.accentColor, 
                  color: theme.accentColor 
                }}
              >
                ← Return Home
              </button>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTravelModal(true);
                }} 
                style={{ 
                  ...styles.travelButton, 
                  backgroundColor: theme.accentColor,
                  borderColor: theme.accentColor,
                  color: theme.bgColor 
                }}
              >
                New Jump →
              </button>
            </div>
          </div>

          {/* Image Gallery */}
          {allImages.length > 0 && (
            <div style={cardStyle} onClick={stopPropagation}>
              <div style={labelStyle}>Temporal Gallery</div>
              <div style={styles.gallery}>
                {allImages.map((url, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      ...styles.thumbnailContainer,
                      borderColor: activeImageIndex === idx ? theme.accentColor : 'transparent',
                      transform: activeImageIndex === idx ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onClick={(e) => selectImage(e, idx)}
                  >
                    <img src={url} alt={`View ${idx + 1}`} style={styles.thumbnail} />
                  </div>
                ))}
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '10px', textAlign: 'center' }}>
                Select an entry to expand the visualization
              </p>
            </div>
          )}

          <div style={cardStyle} onClick={stopPropagation}>
            <div style={labelStyle}>Historical Context</div>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.7', opacity: 0.95, fontWeight: '300' }}>
              {contextText}
            </p>
          </div>

          <div style={styles.list}>
            {[
              { label: 'Environment', value: data.weather },
              { label: 'Language', value: data.language },
              { label: 'Population', value: data.population },
              { label: 'Longevity', value: data.lifeExpectancy }
            ].map((item, idx) => (
              <div key={idx} style={cardStyle} onClick={stopPropagation}>
                <div style={labelStyle}>{item.label}</div>
                <div style={valueStyle}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {!isUIVisible && (
          <div style={styles.hint}>
            Click anywhere to restore temporal data
          </div>
        )}
      </div>

      {/* Expanded Image View (Modal) */}
      {(isModalOpen || isClosing) && (
        <div 
          style={{
            ...styles.modalContainer,
            opacity: isClosing ? 0 : 1,
            pointerEvents: isClosing ? 'none' : 'auto'
          }} 
          onClick={closeModal}
        >
          <div 
            style={styles.modalContent} 
            onClick={stopPropagation} 
            className={isClosing ? 'animate-modal-out' : 'animate-modal'}
          >
            {allImages[activeImageIndex] && (
              <img 
                key={activeImageIndex}
                src={allImages[activeImageIndex]} 
                alt={`${place.name} in ${formattedYear}`} 
                style={styles.modalImage} 
                className="animate-image-change"
              />
            )}
          </div>

          {allImages.length > 1 && (
            <>
              <button 
                style={{...styles.modalNavButton, ...styles.modalNavLeft}}
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                aria-label="Previous image"
              >
                &lt;
              </button>
              <button 
                style={{...styles.modalNavButton, ...styles.modalNavRight}}
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                aria-label="Next image"
              >
                &gt;
              </button>
            </>
          )}
        </div>
      )}

      {showTravelModal && (
        <div style={styles.modalContainer} onClick={closeTravelModal}>
          <div 
            style={{...styles.travelModalContent, backgroundColor: '#0a0f18'}} 
            onClick={stopPropagation}
            className="animate-modal"
          >
            <button 
              style={{...styles.modalCloseButton, color: 'white'}} 
              onClick={closeTravelModal}
              aria-label="Close jump coordinates"
            >
              &times;
            </button>
            <TimeMachine onTravel={handleNewTravel} />
          </div>
        </div>
      )}
    </div>
  );
}

function getDefaultContext(year: number, place: { name: string; terrain: string }, data: { language: string }): string {
  return `You have arrived in ${place.name} during the ${year < 0 ? 'ancient past' : year > 2024 ? 'far future' : 'modern age'}. 
    The ${place.terrain} terrain stretches to the horizon. 
    ${year < 0 
      ? `Civilization is in its cradle, and the echoes of ${data.language.toLowerCase()} fill the wild air.` 
      : year > 2024 
        ? `Advanced technologies have reshaped the world, and ${data.language.toLowerCase()} has evolved into a global standard.`
        : `You are witnessing the peak of modern development in a connected world.`}`;
}

const styles: Record<string, CSSProperties> = {
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.8rem',
    margin: '10px 0',
    fontWeight: '800',
    transition: 'all 0.5s',
    textShadow: '0 0 30px rgba(0,0,0,0.5)',
  },
  location: {
    fontSize: '1.4rem',
    opacity: 0.9,
    marginBottom: '20px',
    fontWeight: '300',
  },
  generatingBadge: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: '30px',
    fontSize: '0.9rem',
    marginBottom: '25px',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(5px)',
  },
  resetButton: {
    padding: '12px 24px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    border: '1px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s',
    fontWeight: '600',
    backdropFilter: 'blur(10px)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    flex: 1,
  },
  travelButton: {
    padding: '12px 24px',
    border: '1px solid',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s',
    fontWeight: '700',
    backdropFilter: 'blur(10px)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    flex: 1,
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    maxWidth: '400px',
    marginTop: '10px',
    justifyContent: 'center',
  },
  travelModalContent: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90vw',
    maxWidth: '800px',
    padding: '40px',
    borderRadius: '32px',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
  },
  gallery: {
    display: 'flex',
    gap: '15px',
    width: '100%',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    overflowX: 'auto',
    padding: '5px',
  },
  thumbnailContainer: {
    flex: '0 0 calc(25% - 12px)',
    aspectRatio: '16/9',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  hint: {
    position: 'absolute',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    opacity: 0.6,
    pointerEvents: 'none',
  },
  modalContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    transition: 'opacity 0.2s ease',
    backdropFilter: 'blur(8px)',
    overflow: 'hidden',
  },
  modalContent: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: '90vw',
    maxHeight: '90vh',
  },
  modalImage: {
    maxWidth: '90vw',
    maxHeight: '90vh',
    objectFit: 'contain',
    cursor: 'zoom-out',
  },
  modalNavButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.4)',
    color: 'white',
    fontSize: '2rem',
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    zIndex: 1001,
    transition: 'all 0.2s ease',
    userSelect: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  modalNavLeft: { left: '40px' },
  modalNavRight: { right: '40px' },
  modalCloseButton: {
    position: 'absolute',
    top: '20px',
    right: '30px',
    fontSize: '2.5rem',
    color: 'white',
    cursor: 'pointer',
    opacity: 0.7,
    transition: 'opacity 0.3s',
    zIndex: 1002,
  }
};
