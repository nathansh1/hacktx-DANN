'use client'
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebaseConfig"; // Adjust the path as necessary
import { doc, getDoc } from "firebase/firestore";
import ace from 'ace-builds/src-noconflict/ace';

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

  const fetchProblemData = async () => {
    try {
      const docRef = doc(db, "problems", "HashTable1"); // replace 'problemID' with a dynamic ID if needed
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProblemData({
          Title: data.Title,
          Description: data.Description,
          Difficulty: data.Difficulty,
          Topics: data.Topics.join(", "), // Assuming topics is an array
          Tests: data.Tests // Assuming testCases is an array of objects
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching problem data:", error);
    }
  };

  useEffect(() => {
    fetchProblemData();
  }, []);

  const languageModes: { [key: string]: string } = {
    python: "ace/mode/python",
    javascript: "ace/mode/javascript",
    cpp: "ace/mode/c_cpp",
    java: "ace/mode/java"
  };

  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python');
  const [output, setOutput] = useState<string>(''); // State to hold output
  const [error, setError] = useState<string>(''); // State to hold error messages

  useEffect(() => {
    if (editorRef.current) {
      const editor = ace.edit(editorRef.current);
      editor.setTheme("ace/theme/github");
      editor.session.setMode(languageModes[selectedLanguage]);
      editor.setValue('print("Hello, World!")', -1);
      editor.container.style.backgroundColor = 'transparent'; // Set the main editor background to transparent
      editor.setOptions({
        highlightActiveLine: true,
        highlightGutterLine: true
      });

      // Make line numbers background transparent
      const editorElement = editor.container as HTMLElement;
      const gutterElement = editorElement.getElementsByClassName('ace_gutter')[0] as HTMLElement;
      if (gutterElement) {
        gutterElement.style.backgroundColor = 'transparent';
        gutterElement.style.borderRight = '1px solid transparent';
      }
    }
  }, [selectedLanguage]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    if (editorRef.current) {
      const editor = ace.edit(editorRef.current);
      editor.session.setMode(languageModes[e.target.value]);
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
      setError(''); // Clear any previous errors
    } else {
      setError(result.error || "An error occurred");
      setOutput(''); // Clear output on error
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Column with Top and Bottom Sections */}
        <div className="p-4 border border-black rounded-md flex flex-col gap-4">
          <div
            className="flex flex-col p-4 border border-black rounded-md bg-transparent overflow-y-auto max-h-48"
          >
            <h2 className="text-xl font-semibold mb-2">{problemData.Title}</h2>
            <p className="mb-2">{problemData.Description}</p>
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
          <div
            className = "flex justify-between items center p-4 border-black rounded-md bg-transparent overflow-y-auto max-h-24"> 
            <p>LLM Output</p>
            <button
                className = "bg-transparent border border-black rounded-md p-2 transition-transform duration-200 hover:scale-105"
            >
                New Problem
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
              backgroundColor: 'transparent'
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
            className={`border border-black p-2 overflow-scroll max-h-32 ${error ? 'bg-red-100 text-red-800' : 'bg-transparent text-black'} text-xs whitespace-pre-wrap`}
          >
            {output || error}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default Problem;
