// components/Hero.tsx
'use client'
import React, { useEffect, useState } from 'react';

const Hero = () => {
  const [scrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    // Adjust this threshold based on when you want the animation to trigger
    if (scrollY > 50) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={`hero-section ${scrolling ? 'animate' : ''}`}>
      <div className="hero-content">
        <h1 className={`hero-title ${scrolling ? 'text-emphasized' : ''}`}>
          Solve LeetCode Problems Faster
        </h1>
        <p className={`hero-text ${scrolling ? 'fade-out' : ''}`}>
          Discover tailored problems to sharpen your coding skills!
        </p>
        <button className='heroButton' style={{
            margin: '1rem',
            padding: '0.3rem 20px', // Horizontal padding of 20px, vertical padding of 0.3rem
            fontSize: '1rem',
            border: '2px solid black', // Black border
            borderRadius: '8px', // Rounded rectangle
            cursor: 'pointer',
            transition: 'transform 0.2s', // Transition effects
          }}>Start Solving Problems</button>
      </div>
    </section>
  );
};

export default Hero;