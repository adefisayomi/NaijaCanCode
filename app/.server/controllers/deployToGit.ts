import fetch from 'node-fetch';
import simpleGit from 'simple-git';
import fs from 'fs';
import path from 'path';

const git = simpleGit();

// Ensure required environment variables are set
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_TOKEN is not set. Please provide a valid GitHub Personal Access Token.');
}

const GITHUB_USER = 'adefisayomi'; // Replace with your GitHub username
const REPO_NAME = 'new-repository-name'; // Replace with the desired repository name

const createRepo = async () => {
  const url = `https://api.github.com/user/repos`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`, // Updated token format for GitHub API
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: REPO_NAME,
      description: 'This is a programmatically created repository.',
      private: false, // Set to `true` if you want the repo to be private
    }),
  });

  if (!response.ok) {
    const errorDetails = await response.text();
    throw new Error(`Failed to create repository: ${response.status} ${errorDetails}`);
  }

  const data = await response.json() as any;
  console.log(`Repository ${REPO_NAME} created successfully at ${data.html_url}`);
  return data.clone_url;
};

const deployRepo = async (repoUrl: any) => {
  const localPath = path.resolve(process.cwd(), REPO_NAME);

  // Ensure the local directory does not already exist
  if (fs.existsSync(localPath)) {
    throw new Error(`Directory "${REPO_NAME}" already exists. Please delete it or choose a different name.`);
  }

  // Clone the repository
  console.log(`Cloning repository into ${localPath}...`);
  await git.clone(repoUrl, localPath);

  // Navigate to the repository
  process.chdir(localPath);

  // Create a sample file
  console.log('Creating a sample file...');
  fs.writeFileSync('index.html', '<h1>Hello, GitHub!</h1>');

  // Initialize git, add, commit, and push
  console.log('Preparing to commit and push changes...');
  await git.add('./*');
  await git.commit('Initial commit with sample file');
  await git.push('origin', 'main'); // Adjust the branch name if needed

  console.log('Repository deployed successfully!');
};

export const deployCode = async () => {
  try {
    console.log('Starting repository deployment...');
    const repoUrl = await createRepo();
    await deployRepo(repoUrl);
  } catch (error: any) {
    console.error('Error during deployment:', error.message);
  }
};


/* 
  STAGES OF DEPLOYMENT - How the code will run

  1- get the user's username and GIT-TOKEN
  2- check if its a new project or already existing one
  3- create a repository if its a new project or check in if its already existing.
  4- get code
  5- deploy

*/ 
