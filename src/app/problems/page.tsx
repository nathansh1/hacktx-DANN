// components/Problem.tsx
const Problem = () => {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Column */}
          <div className="p-4 border border-black rounded-md">
            <h2 className="text-xl font-semibold mb-2">Column 1</h2>
            <p>This is some placeholder text for the first column. It will wrap on smaller screens.</p>
          </div>
  
          {/* Second Column */}
          <div className="p-4 border border-black rounded-md">
            <h2 className="text-xl font-semibold mb-2">Column 2</h2>
            <p>This is some placeholder text for the second column. It will wrap on smaller screens.</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default Problem;
  