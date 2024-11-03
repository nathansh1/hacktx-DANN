'use client'
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebaseConfig"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";
import ace from 'ace-builds/src-noconflict/ace';
import '../styles/globals.css';

interface TestCase {
  input: string;
  expectedOutput: string;
}

const Problem = () => {
  const [problemData, setProblemData] = useState<{
    Title: string;
    Description: string;
    Difficulty: string;
    Topics: string;
    Tests: TestCase[];
  }>({
    Title: "",
    Description: "",
    Difficulty: "",
    Topics: "",
    Tests: []
  });
  
  const [currentProblemId, setCurrentProblemId] = useState<string>('HashTable1'); // Initial problem ID

  const fetchProblemData = async (problemId: string) => {
    try {
      const docRef = doc(db, "problems", problemId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProblemData({
          Title: data.Title,
          Description: data.Description,
          Difficulty: data.Difficulty,
          Topics: data.Topics.join(", "),
          Tests: data.Tests
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching problem data:", error);
    }
  };

  useEffect(() => {
    fetchProblemData(currentProblemId);
  }, [currentProblemId]);

  const languageModes: { [key: string]: string } = {
    python: "ace/mode/python",
    javascript: "ace/mode/javascript",
    cpp: "ace/mode/c_cpp",
    java: "ace/mode/java"
  };

  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [output, setOutput] = useState<string>(''); 
  const [error, setError] = useState<string>(''); 

  useEffect(() => {
    if (editorRef.current) {
      const editor = ace.edit(editorRef.current);
      editor.setTheme("ace/theme/midnight");
      editor.session.setMode(languageModes[selectedLanguage]);
      editor.setValue(getInitialCode(selectedLanguage), -1); // Set initial code based on selected language
      editor.container.style.backgroundColor = 'transparent';
      editor.setOptions({
        highlightActiveLine: true,
        highlightGutterLine: true
      });
    }
  }, [selectedLanguage]);

  const getInitialCode = (language: string): string => {
    switch (language) {
      case 'python':
        return 'print("Hello, World!")';
      case 'javascript':
        return 'console.log("Hello, World!");';
      case 'cpp':
        return '#include <iostream>\nint main() { std::cout << "Hello, World!" << std::endl; return 0; }';
      case 'java':
        return 'public class Main { public static void main(String[] args) { System.out.println("Hello, World!"); } }';
      default:
        return '';
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    if (editorRef.current) {
      const editor = ace.edit(editorRef.current);
      editor.session.setMode(languageModes[e.target.value]);
      editor.setValue(getInitialCode(e.target.value), -1); // Reset editor with new language code
    }
  };

  const handleRunCode = async () => {
    const code = ace.edit(editorRef.current).getValue();
    const response = await fetch("http://127.0.0.1:5000/api/submit_code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ code, language: selectedLanguage })
    });

    const result = await response.json();
    if (response.ok) {
      setOutput(result.output);
      setError('');
    } else {
      setError(result.error || "An error occurred");
      setOutput('');
    }
  };

  const handleNextProblem = () => {
    const problemIds = ['HashTable1', 'HashTable2', 'HashTable3', 'Array1', 'Array2', 'Array3']; // Example problem IDs
    const currentIndex = problemIds.indexOf(currentProblemId);
    const nextIndex = (currentIndex + 1) % problemIds.length; // Wrap around to the first
    const nextProblemId = problemIds[nextIndex]; // Get the next problem ID

    setCurrentProblemId(nextProblemId); // Set the next problem ID

    // Clear the output and input fields
    const outputElement = document.getElementById("output");
    const editorElement = ace.edit(editorRef.current); // Get the editor instance

    if (outputElement) {
      outputElement.innerText = ''; // Clear output
    }

    if (editorElement) {
      editorElement.setValue('', -1); // Clear the editor input
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Column with Top and Bottom Sections */}
        <div className="p-4 border border-black rounded-md flex flex-col gap-4">
          <div className="flex flex-col p-4 border border-black rounded-md bg-transparent overflow-y-auto max-h-48">
            <h2 className="text-xl font-semibold mb-2">{problemData.Title}</h2>
            {problemData.Description.split("\\n").map((line, index) => {
              if(line.trim() === '') {
                return <br key={index} />;
              }
              return <p key={index}>{line}</p>
            })}
            <p className="text-sm text-gray-700 mb-2">{problemData.Difficulty}</p>
            <p className="text-sm text-gray-700 mb-2">{problemData.Topics}</p>
            <h3 className="text-xl font-semibold mt-4">Test Cases</h3>
            <ul className="list-disc list-inside">
              {problemData.Tests.map((testCase, index) => (
                <li key={index}>
                  <strong>Input:</strong> {testCase.input} <br />
                  <strong>Expected Output:</strong> {testCase.expectedOutput}
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Section with Helper and Next Problem Button */}
          <div className="flex flex-col gap-2 mt-4 h-full">
            <div className="flex-1 p-4 border border-black rounded-md bg-transparent text-left overflow-y-auto max-h-32 whitespace-pre-wrap">
              <p className="text-lg">Helper:</p>
            </div>
            <button
              onClick={handleNextProblem} // Call the next problem handler
              style={{
                  margin: '.1rem',
                  padding: '0.3rem 20px',
                  fontSize: '1rem',
                  border: '1px solid black',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}>
                Next Problem
              </button>
          </div>
        </div>

        {/* Second Column with Ace Editor */}
        <div className="p-4 border border-black rounded-md">
          <h2 className="text-2xl font-semibold mb-2">Code Editor</h2>
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="mb-2 bg-transparent border border-black rounded-md p-2"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          <div
            ref={editorRef}
            style={{
              height: '300px',
              width: '100%',
              border: '1px solid black',
              backgroundColor: 'transparent' // Fully transparent background for the editor
            }}
          ></div>
          <button
            id="run"
            className="mt-2 bg-transparent border border-black rounded-md p-2 transition-transform duration-200 hover:scale-105"
            onClick={handleRunCode}
          >
            Run Code
          </button>
          <h3 className="mt-4 text-2xl font-semibold mb-2">Output:</h3>
          <pre
            id="output"
            className={`border border-black p-2 overflow-scroll max-h-32 bg-transparent`} // Set output box to have a transparent background
          >
            {error ? error : output}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Problem;
