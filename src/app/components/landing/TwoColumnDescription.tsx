// components/TwoColumnDescription.tsx
'use client'
import { useEffect, useRef, useState } from 'react';

const TwoColumnDescription = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [opacity, setOpacity] = useState(0); // New state for opacity

  useEffect(() => {
    const handleScroll = () => {
      if (headingRef.current) {
        const rect = headingRef.current.getBoundingClientRect();
        const maxHeight = 10; // Maximum height of the underline
        const scrollY = Math.max(0, window.scrollY - rect.top); // Scroll position relative to the heading

        // Calculate the height based on scroll position, limited by maxHeight
        const newHeight = Math.min(scrollY, maxHeight);
        setScrollHeight(newHeight);

        // Calculate opacity based on scroll position, maxing out at 0.3
        const newOpacity = Math.min(scrollY / maxHeight, 1) * 0.3;
        setOpacity(newOpacity);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex max-w-7xl mx-auto py-8 justify-between">
      {/* Left Column with Content */}
      <div className="flex-1 pr-2">
        <div className="border border-black rounded-lg p-4 relative">
          <h2 ref={headingRef} className="text-4xl font-bold mb-4">
            So What is This?
            <span
              style={{
                display: 'block',
                width: '100%',
                height: `${scrollHeight}px`, // Height controlled by scroll
                backgroundColor: 'black',
                transition: 'height 0.2s ease, opacity 0.2s ease',
                opacity: opacity,
                position: 'absolute',
                top: '-5px', // Adjust to position the underline
                left: 0,
              }}
            />
          </h2>
          <p className="text-lg">
            Our product is an AI recommender for LeetCode problems that analyzes user preferences and skills
            to suggest the most relevant problems for practice. With an intuitive interface, you can easily
            find challenges that match your learning goals, helping you to prepare efficiently for technical interviews.
          </p>
        </div>
      </div>
      <div className="flex-1 pl-2">
        <div className="border border-black rounded-lg p-4">
          <p>Placeholder content goes here...</p>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnDescription;
