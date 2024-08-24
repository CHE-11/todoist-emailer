const fs = require('fs');
const path = require('path');

// Function to copy .env.development file
const copyEnvFile = () => {
  // Define the source and destination paths
  const cwd = process.cwd(); // Current working directory
  const lastSegment = path.basename(cwd); // Last segment of the current working directory
  
  const sourcePath = path.join('S:/_secrets_', lastSegment, '.env');
  const destinationPath = path.join(cwd, '.env');

  const sourcePathProjects = path.join('S:/_secrets_', lastSegment, 'projects.ts');
  const destinationPathProjects = path.join(cwd, '/src/config/projects.ts'); 

  console.log({ sourcePath, destinationPath, sourcePathProjects, destinationPathProjects})

  // Copy the files
  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error('Error copying the env file:', err);
      return;
    }
    console.log('.env was copied successfully');
  });

  fs.copyFile(sourcePathProjects, destinationPathProjects, (err) => {
    if (err) {
      console.error('Error copying the projects.ts file:', err);
      return;
    }
    console.log('projects.ts was copied successfully');
  });


};

// Execute the function
copyEnvFile();
