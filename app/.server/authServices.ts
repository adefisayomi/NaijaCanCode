import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { GitHubStrategy } from "remix-auth-github";
import fetch from "node-fetch";
import { UserType } from "./schemas/user";
import { signinUser } from "./controllers";

type RAccount = {
  success: boolean;
  message: string | null;
  data: UserType | null;
};

export let authenticator = new Authenticator<RAccount>();

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const id = form.get("id") as string | undefined;
    const password = form.get("password") as string | undefined;

    if (!id || !password) {
      throw new Error("Email/Username and password are required.");
    }

    // Call the signinUser function
    const response = await signinUser(id, password);

    if (!response.success) {
      throw new Error(response.message || "Authentication failed.");
    }

    // Return the authenticated user data
    return {
      success: true,
      message: "Authentication successful.",
      data: response.data,
    };
  }),
  "signin"
);




authenticator.use(
  new GitHubStrategy(
    {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectURI: "http://localhost:3000/auth/callback",
      scopes: ["user:email"], // Optionally specify additional scopes
    },
    async ({ tokens, request }) => {
      try {
        // Log the tokens for debugging (remove in production)
        console.log('GitHub Tokens:', tokens);

        if (!tokens.accessToken) {
          throw new Error('Missing access token.');
        }

        // Fetch user data from GitHub API
        const response = await fetch('https://api.github.com/user', {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
            'User-Agent': 'YourAppName', // Replace with your app's name
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        const userData = await response.json();
        console.log('GitHub User Data:', userData);

        // Return user data and tokens
        return {
          data: userData,
          tokens, // Include tokens if needed for further processing
          success: true,
          message: 'Authentication successful',
        };
      } catch (error) {
        console.error('GitHub Authentication Error:', error);
        return {
          data: null,
          tokens: null,
          success: false,
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        };
      }
    }
  ),
  "github" // Optional custom strategy name
);
