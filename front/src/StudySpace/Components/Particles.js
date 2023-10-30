import React, { useState, useEffect, useRef } from 'react';

// Rain Particles
function RainParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setParticles(prevParticles => {
        const randomX = Math.random() * (window.innerWidth - 10) + 5;
        const newParticle = {
          x: randomX,
          y: 0,
          speed: Math.random() * 10 + 5,
          size: Math.random() * 20 + 10,
        };
        const updatedParticles = [...prevParticles, newParticle].filter(particle => particle.y <= window.innerHeight);
        return updatedParticles.map(particle => ({ ...particle, y: particle.y + particle.speed }));
      });
    }, 10);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%', pointerEvents: 'none' }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: 3,
            height: particle.size,
            backgroundColor: 'blue',
            opacity: particle.speed / 20,
            borderRadius: '25%',
          }}
        />
      ))}
    </div>
  );
}

// Fire Particles
function FireParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setParticles(prevParticles => {
        const randomX = Math.random() * (window.innerWidth - 10) + 5;
        const newParticle = {
          x: randomX,
          y: window.innerHeight,
          speed: Math.random() * 10 + 5,
          size: Math.random() * 7 + 3,
        };
        const updatedParticles = [...prevParticles, newParticle].filter(particle => particle.y >= 0);
        return updatedParticles.map(particle => ({
          ...particle,
          y: particle.y - particle.speed,
          size: particle.size + (Math.random() * 2 - 1),
        }));
      });
    }, 10);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%', pointerEvents: 'none' }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: 'orange',
            opacity: particle.speed / 20,
            borderRadius: '50%',
          }}
        />
      ))}
    </div>
  );
}

function EmojiRain() {
  const [emojis, setEmojis] = useState([]);
  const emojiList = ['📚', '📖', '📝', '🤓', '📓', '🎓', '🧠', '✏️', '📁', '🖊️', '🧮', '🖥️', '🎒', '🔬', '🧪', '🔍', '🗂️', '📋', '📅', '📊'];

  const animationRef = useRef();

  // Function to generate new emojis
  const generateEmoji = () => {
    const randomX = Math.random() * window.innerWidth;
    const newEmoji = {
      id: Date.now(),
      x: randomX,
      y: 0,
      speed: Math.random() * 3 + 1,
      size: Math.random() * 20 + 20,
      emoji: emojiList[Math.floor(Math.random() * emojiList.length)],
    };
    setEmojis((prevEmojis) => [...prevEmojis, newEmoji]);
  };

  useEffect(() => {
    const animateEmojis = () => {
      setEmojis((prevEmojis) => {
        const updatedEmojis = prevEmojis.map((emoji) => ({ ...emoji, y: emoji.y + emoji.speed }));
        return updatedEmojis.filter((emoji) => emoji.y < window.innerHeight); // Remove emojis off screen
      });

      animationRef.current = requestAnimationFrame(animateEmojis);
    };

    // Call the generateEmoji function at a specified rate
    const emojiGenerationInterval = 100; // Adjust as needed (milliseconds)
    const emojiGenerationTimer = setInterval(generateEmoji, emojiGenerationInterval);

    animationRef.current = requestAnimationFrame(animateEmojis);

    return () => {
      clearInterval(emojiGenerationTimer);
      cancelAnimationFrame(animationRef.current);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div style={{ position: 'fixed', width: '100%', height: '100%', pointerEvents: 'none' }}>
      {emojis.map((emoji) => (
        <div
          key={emoji.id}
          style={{
            position: 'absolute',
            left: emoji.x,
            top: emoji.y,
            fontSize: emoji.size,
          }}
        >
          {emoji.emoji}
        </div>
      ))}
    </div>
  );
}


export { RainParticles, FireParticles, EmojiRain }
