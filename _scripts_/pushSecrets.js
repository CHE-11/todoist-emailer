const fs = require('fs');
const path = require('path');

// Function to copy .env.development file
const copyEnvFile = () => {
  // Define the source and destination paths
  const cwd = process.cwd(); // Current working directory
  const lastSegment = path.basename(cwd); // Last segment of the current working directory
  
  const sourcePath = path.join(cwd, '.env');
  const destinationPath = path.join('S:/_secrets_', lastSegment, '.env');

  console.log({ sourcePath, destinationPath })

  // Copy the files
  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error('Error copying the file:', err);
      return;
    }
    console.log('.env was copied successfully');
  });
};

// Execute the function
copyEnvFile();
