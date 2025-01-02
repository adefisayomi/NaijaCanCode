import { redirect } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { errorMessage } from '~/src/constants'
import axios from 'axios'


export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code || !state) {
      throw new Error('Invalid request! Missing "code" or "state".');
    }

    // Prepare payload for token exchange
    const payload = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: 'http://localhost:3000/auth/callback', // Must match GitHub App settings
      state,
    };

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json', // Ensure GitHub returns JSON
        },
      }
    );

    if (tokenResponse.status !== 200 || !tokenResponse.data) {
      throw new Error('Failed to retrieve access token.');
    }

    const data = tokenResponse.data;

    if (data.error) {
      throw new Error(`GitHub OAuth Error: ${data.error_description || data.error}`);
    }

    // Return the access token and additional data
    return {
      data,
      success: true,
      message: 'Access token retrieved successfully',
    };
  } catch (err: any) {
    console.error('OAuth Error:', err.message);
    return {
      success: false,
      message: err.message || 'An unknown error occurred.',
    };
  }
};




// const handleGitHubCallback = async (req, res) => {
//   const { code, state } = req.query;

//   if (!code || !state) {
//     return res.status(400).send('Invalid callback parameters');
//   }

//   try {
//     // Exchange the authorization code for an access token
//     const response = await fetch('https://github.com/login/oauth/access_token', {
//       method: 'POST',
//       headers: {
//         Accept: 'application/json',
//       },
//       body: JSON.stringify({
//         client_id: process.env.GITHUB_CLIENT_ID,
//         client_secret: process.env.GITHUB_CLIENT_SECRET,
//         code,
//         redirect_uri: 'http://localhost:3000/auth/callback', // Ensure this matches your GitHub App settings
//         state, // Verify the state parameter
//       }),
//     });

//     const data = await response.json();

//     if (data.error) {
//       throw new Error(data.error_description || 'Failed to retrieve access token');
//     }

//     const accessToken = data.access_token;

//     // Fetch user data with the access token
//     const userResponse = await fetch('https://api.github.com/user', {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         'User-Agent': 'YourAppName', // Replace with your app name
//       },
//     });

//     const userData = await userResponse.json();
//     console.log('User Data:', userData);

//     // Redirect or respond with user data
//     res.redirect('/dashboard'); // Or handle user session creation
//   } catch (error) {
//     console.error('GitHub Callback Error:', error);
//     res.status(500).send('Authentication failed');
//   }
// };
