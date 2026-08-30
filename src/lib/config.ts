/**
 * Environment configuration and validation
 */

const requiredEnvVars = ['GEMINI_API_KEY'];

/**
 * Validate that all required environment variables are set
 */
export function validateEnvironment(): void {
  const missingVars: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.error(
      `❌ Missing environment variables: ${missingVars.join(', ')}`
    );
    console.error('Please check your .env.local file and add the missing values.');
    console.error('See .env.example for reference.');
    throw new Error(`Required environment variables are not set: ${missingVars.join(', ')}`);
  }

  console.log('✅ Environment variables validated successfully');
}

/**
 * Get Gemini API configuration
 */
export function getGeminiConfig() {
  return {
    apiKey: process.env.GEMINI_API_KEY,
    model: process.env.GEMINI_API_MODEL || 'gemini-3.6-flash',
    version: process.env.GEMINI_API_VERSION || 'v1beta',
  };
}

/**
 * Get app configuration
 */
export function getAppConfig() {
  return {
    name: process.env.NEXT_PUBLIC_APP_NAME || 'AI Chatbot',
    apiTimeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  };
}
