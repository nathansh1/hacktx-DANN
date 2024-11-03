// components/Dashboard.tsx
'use client';
import { useEffect, useState } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

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

type CompletionMap = {
  [key: string]: number; // Map topic names to completion percentage values (0-100)
};

const Dashboard = ({ username }: { username: string }) => {
  const [completion, setCompletion] = useState<CompletionMap>({});

  useEffect(() => {
    // Fetch progress data for the specified user
    const fetchProgressData = async () => {
      try {
        const docRef = doc(db, "Progression", username);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const completionData = data.Completion || {};
          setCompletion(completionData);
        } else {
          console.log("No document found for the specified user.");
        }
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };

    fetchProgressData();
  }, [username]);

  return (
    <div className="max-w-4xl mx-auto my-6 p-6 border border-black rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Progress Dashboard</h1>
      </div>

      <div className="space-y-4">
        {topics.map((topic, index) => {
          const progressValue = completion[topic] ?? 0; // Default to 0 if no data for the topic
          return (
            <div key={index} className="flex items-center justify-between">
              <span className="text-lg">{topic}</span>
              <div className="relative flex-1 mx-4">
                <div className="h-2 bg-gray-300 rounded">
                  <div
                    className="h-full bg-gray-600 opacity-75 rounded transition-all duration-500"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
              <span className="text-sm text-gray-600">{`${progressValue}%`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
