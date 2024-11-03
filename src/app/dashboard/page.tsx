// components/Dashboard.tsx
'use client';
import { useState } from 'react';

const topics = [
  'Array',
  'Two Pointers',
  'Sorting',
  'Hash Table',
  'Binary Search',
  'Divide and Conquer',
  'String',
  'Sliding Window',
  'Matrix',
  'Prefix Sum',
  'Greedy',
];

// Define the type for the problems object
type ProblemsMap = {
  [key in typeof topics[number]]: string[];
};

// Sample problems for each topic
const problems: ProblemsMap = {
  Array: ['Array Problem 1', 'Array Problem 2', 'Array Problem 3'],
  'Two Pointers': ['Two Pointer Problem 1', 'Two Pointer Problem 2'],
  Sorting: ['Sorting Problem 1', 'Sorting Problem 2', 'Sorting Problem 3'],
  'Hash Table': ['Hash Table Problem 1', 'Hash Table Problem 2'],
  'Binary Search': ['Binary Search Problem 1'],
  'Divide and Conquer': ['Divide and Conquer Problem 1', 'Divide and Conquer Problem 2'],
  String: ['String Problem 1', 'String Problem 2'],
  'Sliding Window': ['Sliding Window Problem 1', 'Sliding Window Problem 2'],
  Matrix: ['Matrix Problem 1'],
  'Prefix Sum': ['Prefix Sum Problem 1'],
  Greedy: ['Greedy Problem 1', 'Greedy Problem 2'],
};

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  const toggleDropdown = (topic: string) => {
    setDropdownOpen(prev => (prev === topic ? null : topic));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Progress Dashboard</h1>
      <div className="space-y-4">
        {topics.map((topic, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-lg">{topic}</span>
            <div className="relative flex-1 mx-4">
              <div className="h-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-blue-600 rounded transition-all duration-500"
                  style={{ width: `${Math.random() * 100}%` }} // Placeholder for progress
                />
              </div>
            </div>
            <span className="text-sm text-gray-600">{`${Math.round(Math.random() * 100)}%`}</span>

            {/* Problems Button */}
            <button
              onClick={() => toggleDropdown(topic)}
              className="ml-4 bg-gray-300 text-black font-semibold py-1 px-3 rounded hover:bg-gray-400 transition duration-300"
            >
              Problems
            </button>
            
            {/* Dropdown for Problems */}
            {dropdownOpen === topic && (
              <div className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg w-48">
                <ul className="max-h-48 overflow-y-auto">
                  {problems[topic].map((problem, idx) => (
                    <li key={idx} className="px-4 py-2 border-b text-sm hover:bg-gray-100">
                      {problem}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => setDropdownOpen(null)} // Close all dropdowns
        className="mt-8 w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600 transition duration-300"
      >
        Recommend Next Problems
      </button>

      {/* Additional Dropdown for Recommendations */}
      {dropdownOpen && (
        <div className="mt-4 border rounded-lg p-4 bg-white shadow-lg">
          <h2 className="font-semibold text-lg mb-2">Recommended Problems</h2>
          <ul className="space-y-2">
            <li className="border-b pb-2">Placeholder Problem 1</li>
            <li className="border-b pb-2">Placeholder Problem 2</li>
            <li className="border-b pb-2">Placeholder Problem 3</li>
          </ul>
          <button className="mt-4 w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-600 transition duration-300">
            Try this problem
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
