import pandas as pd
import subprocess
import ast

def run_code(code, test_case, expected_output):
    """Executes the code and compares the output to the expected result."""
    # Write the code to a temporary file
    with open("temp_solution.py", "w") as f:
        f.write(code)
        
    try:
        # Run the code using subprocess
        result = subprocess.run(["python3", "temp_solution.py"], capture_output=True, text=True)
        output = result.stdout.strip()
        
        # Compare the actual output to the expected output
        return output == expected_output
    except Exception as e:
        print(f"Execution failed: {e}")
        return False

def test_all_cases(csv_file_path):
    """Reads the CSV, runs all test cases, and prints whether all test cases passed."""
    df = pd.read_csv(csv_file_path)
    all_tests_passed = True
    
    for index, row in df.iterrows():
        code = row["Code"]
        test_cases = row["Test Cases"].split()
        
        for test in test_cases:
            test_input, expected_output = test.split("=")
            test_input = ast.literal_eval(test_input.strip())
            expected_output = expected_output.strip()
            
            if not run_code(code, test_input, expected_output):
                print(f"Test case failed: {test_input}")
                all_tests_passed = False

    if all_tests_passed:
        print("All test cases passed")
    else:
        print("Some test cases failed")

# Run the test function
if __name__ == "__main__":
    test_all_cases("problems.csv")