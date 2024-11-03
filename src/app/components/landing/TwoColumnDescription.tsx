'use client';
import { useEffect, useRef, useState } from 'react';

const TwoColumnDescription = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [opacity, setOpacity] = useState(0); // State for opacity

  const programmingWords = [
    "const", "function", "=>", "return", "if", "else",
    "{", "}", "class", "let", "useState", "<>", "!==",
    "import", "export", "async", "await", "Promise",
    "map", "filter", "reduce", "forEach", "try", "catch",
    "throw", "axios", "fetch", "API", "JSON", "npm",
    "yarn", "webpack", "babel", "React", "Vue", "Angular",
    "CSS", "HTML", "Node.js", "Express", "TypeScript",
    "Python", "Java", "C++", "Ruby", "Go"
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (headingRef.current) {
        const rect = headingRef.current.getBoundingClientRect();
        const maxHeight = 10; // Maximum height of the underline
        const scrollY = Math.max(0, window.scrollY - rect.top); // Scroll position relative to the heading

        // Calculate the height based on scroll position, limited by maxHeight
        const newHeight = Math.min(scrollY, maxHeight);
        setScrollHeight(newHeight);

        // Calculate opacity based on scroll position, maxing out at 30
        const newOpacity = Math.min(scrollY / maxHeight, 1) * 30;
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
                width: '70%',
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

      {/* Right Column with Falling Text Animation */}
      <div className="flex-1 pl-2">
        <div className="border border-black rounded-lg p-4 relative min-h-64 overflow-hidden">
          <div className="absolute inset-0 flex flex-wrap items-start justify-center">
            {Array.from({ length: 20 }).map((_, index) => (
              <span
                key={index}
                className="falling-word"
                style={{
                  fontSize: '2rem',
                  color: 'black',
                  position: 'absolute',
                  top: `${Math.random() * -80}px`, // Start above the visible area
                  left: `${Math.random() * 110}%`,
                  animation: `fall ${Math.random() * 3 + 2}s linear infinite`, // Random duration for each word
                  opacity: 0, // Start with opacity 0
                  animationDelay: `${Math.random() * 3}s`, // Delay to stagger animations
                }}
              >
                {programmingWords[index % programmingWords.length]}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Add falling text keyframes to the global styles */}
      <style jsx global>{`
        @keyframes fall {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh); // Move down off-screen
            opacity: 0; // Fade out
          }
        }
      `}</style>
    </div>
  );
};

export default TwoColumnDescription;
