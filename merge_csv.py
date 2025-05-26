import os
import pandas as pd

# Define the path to the DataFrames folder and the output file
dataframes_folder = r"c:\Users\karlo\Desktop\VizualizacijaPodataka\VizualizacijaPodatakaProjekt\DataFrames"
output_file = r"c:\Users\karlo\Desktop\VizualizacijaPodataka\VizualizacijaPodatakaProjekt\merged_data.csv"

# Get a list of all CSV files in the folder, sorted to ensure a consistent order
csv_files = sorted([f for f in os.listdir(dataframes_folder) if f.endswith('.csv')])

if not csv_files:
    print("No CSV files found in the directory.")
else:
    # Initialize an empty list to hold DataFrames
    all_data = []
    
    # Read the first file to get the header
    first_file_path = os.path.join(dataframes_folder, csv_files[0])
    df_first = pd.read_csv(first_file_path)
    all_data.append(df_first) # Add the first DataFrame (with header)

    # Loop through the rest of the CSV files and append their data (without header)
    for file_name in csv_files[1:]:
        file_path = os.path.join(dataframes_folder, file_name)
        try:
            # Read CSV, skipping the header row for subsequent files
            df = pd.read_csv(file_path, header=0) # Assuming header is on the first line
            # Ensure columns match the first file's columns to avoid issues
            # If columns don't match, this will raise an error or you might need to handle it
            # For simplicity, we assume columns are consistent as per the request
            all_data.append(df)
        except Exception as e:
            print(f"Error reading {file_name}: {e}")

    # Concatenate all DataFrames
    if all_data:
        merged_df = pd.concat(all_data, ignore_index=True)
        
        # Write the merged DataFrame to a new CSV file
        merged_df.to_csv(output_file, index=False)
        print(f"Successfully merged all CSV files into {output_file}")
    else:
        print("No data to merge.")
