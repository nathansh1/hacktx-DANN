// components/TwoColumnDescription.tsx
'use client'
import { useEffect, useRef, useState } from 'react';

const TwoColumnDescription = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [scrollHeight, setScrollHeight] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (headingRef.current) {
        const rect = headingRef.current.getBoundingClientRect();

        // Trigger animation when the heading is in view
        if (rect.top <= 0 && !isScrolled) {
          setIsScrolled(true);
        } else if (rect.top > 0 && isScrolled) {
          setIsScrolled(false);
        }

        // Update the height of the black border based on scroll position
        if (isScrolled) {
          const maxHeight = headingRef.current.clientHeight;
          setScrollHeight(Math.min(window.scrollY, maxHeight));
        } else {
          setScrollHeight(1); // Reset when heading is not scrolled
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

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
                content: '""',
                width: '100%',
                height: `${scrollHeight}px`,
                backgroundColor: 'black',
                transition: 'height 0.2s ease, opacity 0.2s ease',
                opacity: scrollHeight > 1 ? 1 : 0,
                position: 'absolute',
                bottom: 0,
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
