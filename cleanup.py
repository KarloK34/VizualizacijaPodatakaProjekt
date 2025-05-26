import pandas as pd

# Define the input and output file paths
file_path = r"c:\Users\karlo\Desktop\VizualizacijaPodataka\VizualizacijaPodatakaProjekt\merged_data.csv"

try:
    # Read the CSV file
    df = pd.read_csv(file_path)

    # 1. Drop the first column
    # df.iloc[:, 1:] selects all rows and all columns from the second column onwards
    df = df.iloc[:, 1:]

    # 2. Sort the DataFrame by 'Pontiffnumber'
    # First, ensure 'Pontiffnumber' is numeric, coercing errors to NaN
    df['Pontiffnumber'] = pd.to_numeric(df['Pontiffnumber'], errors='coerce')
    
    # Drop rows where 'Pontiffnumber' became NaN (if any non-numeric values existed)
    df.dropna(subset=['Pontiffnumber'], inplace=True)
    
    # Convert 'Pontiffnumber' to integer type for proper sorting if it's not already
    df['Pontiffnumber'] = df['Pontiffnumber'].astype(int)
    
    # Sort the DataFrame
    df_sorted = df.sort_values(by='Pontiffnumber', ascending=True)

    # Save the modified DataFrame back to the original file (or a new file)
    df_sorted.to_csv(file_path, index=False) # index=False to not write pandas index as a column
    
    print(f"Successfully modified and saved {file_path}")
    print("Dropped the first column and sorted by 'Pontiffnumber'.")

except FileNotFoundError:
    print(f"Error: The file {file_path} was not found.")
except Exception as e:
    print(f"An error occurred: {e}")