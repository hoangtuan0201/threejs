import CryptoJS from 'crypto-js';

// Wasabi credentials
const ACCESS_KEY = 'OQL1BX7MOF71KL0MM0UM';
const SECRET_KEY = '07e80kBbTY2T9kPr1E43kMiq1PkO6lw9LUDhKeMi';
const REGION = 'ap-southeast-2';
const BUCKET = 'airsmart';

/**
 * Generate a signed URL for Wasabi S3 compatible storage
 * @param {string} objectKey - The object key (path) in the bucket
 * @param {number} expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns {string} - Signed URL
 */
export const getSignedUrl = (objectKey, expiresIn = 3600) => {
  try {
    // Ensure objectKey doesn't start with a slash
    if (objectKey.startsWith('/')) {
      objectKey = objectKey.substring(1);
    }

    // URL encode the object key
    const encodedKey = encodeURIComponent(objectKey).replace(/%20/g, '+');
    
    // Calculate expiration timestamp
    const expires = Math.floor(Date.now() / 1000) + expiresIn;
    
    // Create the string to sign
    const stringToSign = `GET\n\n\n${expires}\n/${BUCKET}/${encodedKey}`;
    
    // Create the signature
    const signature = CryptoJS.HmacSHA1(stringToSign, SECRET_KEY);
    const encodedSignature = encodeURIComponent(signature.toString(CryptoJS.enc.Base64));
    
    // Construct the signed URL
    const signedUrl = `https://s3.${REGION}.wasabisys.com/${BUCKET}/${encodedKey}?AWSAccessKeyId=${ACCESS_KEY}&Expires=${expires}&Signature=${encodedSignature}`;
    
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

/**
 * Extract object key from a Wasabi URL
 * @param {string} url - The full Wasabi URL
 * @returns {string} - The object key
 */
export const getObjectKeyFromUrl = (url) => {
  try {
    // Handle both URL formats
    if (url.includes('wasabisys.com')) {
      // Extract from full URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      // Remove empty first element and bucket name
      pathParts.shift(); // Remove empty first element
      pathParts.shift(); // Remove bucket name
      return pathParts.join('/');
    } else if (url.startsWith('/')) {
      // Already an object key with leading slash
      return url.substring(1);
    } else {
      // Already an object key without leading slash
      return url;
    }
  } catch (error) {
    console.error('Error extracting object key:', error);
    return url;
  }
};

/**
 * Convert a regular Wasabi URL to a signed URL
 * @param {string} url - The regular Wasabi URL
 * @param {number} expiresIn - Expiration time in seconds
 * @returns {string} - Signed URL
 */
export const convertToSignedUrl = (url, expiresIn = 3600) => {
  const objectKey = getObjectKeyFromUrl(url);
  return getSignedUrl(objectKey, expiresIn);
};
