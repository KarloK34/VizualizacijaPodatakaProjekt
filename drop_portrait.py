import pandas as pd

# Define the file path
file_path = r"c:\Users\karlo\Desktop\VizualizacijaPodataka\VizualizacijaPodatakaProjekt\merged_data.csv"

try:
    # Read the CSV file
    df = pd.read_csv(file_path)

    # Check if the 'Portrait' column exists
    if 'Portrait' in df.columns:
        # Drop the 'Portrait' column
        df = df.drop(columns=['Portrait'])
        
        # Save the modified DataFrame back to the original file
        df.to_csv(file_path, index=False)
        print(f"Successfully dropped the 'Portrait' column and saved the changes to {file_path}")
    else:
        print(f"'Portrait' column not found in {file_path}. No changes made.")

except FileNotFoundError:
    print(f"Error: The file {file_path} was not found.")
except pd.errors.EmptyDataError:
    print(f"Error: The file {file_path} is empty and cannot be processed.")
except Exception as e:
    print(f"An error occurred: {e}")