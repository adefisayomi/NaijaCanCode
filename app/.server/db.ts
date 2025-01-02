import { connect, connection } from 'mongoose';

let isConnected = false; // Keep track of the connection state
const MAX_RETRIES = 5; // Maximum number of retries
const RETRY_DELAY = 2000; // Delay between retries in milliseconds

/**
 * Initializes the MongoDB connection with retry logic.
 * @returns {Promise<void>} Resolves if the connection is successful; otherwise throws an error.
 */
export default async function dbInit(): Promise<void> {
  if (isConnected) {
    console.log('Using existing database connection.');
    return;
  }

  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('Invalid connection string: MONGO_URI is undefined.');

  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await connect(uri);
      isConnected = true;
      console.log('Database connection established successfully!');
      return;
    } catch (err: unknown) {
      retries++;
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred.';
      console.error(`Database connection failed (attempt ${retries}/${MAX_RETRIES}):`, errorMessage);

      if (retries < MAX_RETRIES) {
        console.log(`Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      } else {
        throw new Error('Database connection failed after maximum retries.');
      }
    }
  }
}
