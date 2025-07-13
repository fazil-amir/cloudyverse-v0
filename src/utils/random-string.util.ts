// Generate a random string of specified length
export const generateRandomString = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Generate a random string with timestamp
export const generateRandomStringWithTimestamp = (): string => {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const randomPart = generateRandomString(8);
  return `${timestamp}_${randomPart}`;
};

// Generate a random string with prefix
export const generateRandomStringWithPrefix = (prefix: string = 'TEST'): string => {
  const randomPart = generateRandomString(6);
  return `${prefix}_${randomPart}`;
};

// Generate multiple random strings
export const generateMultipleRandomStrings = (count: number, length: number = 10): string[] => {
  return Array.from({ length: count }, () => generateRandomString(length));
}; 