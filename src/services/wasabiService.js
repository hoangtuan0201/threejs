// Frontend Wasabi service - Uses deployed backend API

// Backend API configuration - Production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api2.heartstribute.com'


/**
 * Format file size helper
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get file type from filename
 */
const getFileTypeFromName = (fileName) => {
  const extension = fileName.toLowerCase().split('.').pop();

  const typeMap = {
    'pdf': 'pdf',
    'doc': 'document',
    'docx': 'document',
    'xls': 'spreadsheet',
    'xlsx': 'spreadsheet',
    'jpg': 'image',
    'jpeg': 'image',
    'png': 'image',
    'gif': 'image',
    'txt': 'text'
  };

  return typeMap[extension] || 'unknown';
};

/**
 * Make API request to backend
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Lấy danh sách files từ Wasabi bucket via deployed backend
 */
export const listFiles = async (folderOrPrefix = '') => {
  try {
    // Use the specific endpoint for salesperson role
    const response = await apiRequest('/files/role/salesperson');

    // Backend API returns different structure
    if (response && response.files && Array.isArray(response.files)) {
      let files = response.files;

      // Convert to expected format
      const formattedFiles = files.map((file, index) => {
        return {
          id: index + 1,
          key: file.key,
          name: file.name,
          size: formatFileSize(file.size || 0),
          sizeBytes: file.size || 0,
          date: file.lastModified ? new Date(file.lastModified).toLocaleDateString() : 'Unknown',
          lastModified: file.lastModified ? new Date(file.lastModified) : new Date(),
          type: getFileTypeFromName(file.name || ''),
          url: file.previewUrl || file.url || '#',
          downloadUrl: file.downloadUrl || file.url || '#',
          description: `Document from salesperson folder`
        };
      });

      // Filter by folder if specified (though engineer endpoint already filters)
      if (folderOrPrefix && folderOrPrefix !== 'salesperson') {
        return formattedFiles.filter(file =>
          file.key && file.key.includes(folderOrPrefix)
        );
      }



      return formattedFiles;
    } else {
      throw new Error('No files found or invalid response format');
    }
  } catch (error) {
    throw new Error('Failed to load files from storage. Please try again.');
  }
};

/**
 * Lấy files từ folder cụ thể
 */
export const getFilesFromFolder = async (folderPath) => {
  try {
    const files = await listFiles(folderPath);
    return files.filter(file => !file.key.endsWith('/'));
  } catch (error) {
    throw error;
  }
};

/**
 * Tạo URL cho file viewing - URLs already provided by backend
 */
export const getFileViewUrl = async (fileKey, expiresIn = 3600) => {
  try {
    // Backend already provides presigned URLs, so we don't need to generate them
    // This function is kept for compatibility but URLs are already in file objects
    const response = await apiRequest('/files/role/salesperson');

    if (response.files) {
      const file = response.files.find(f => f.key === fileKey);
      if (file) {
        return file.previewUrl || file.url;
      }
    }

    throw new Error('File not found');
  } catch (error) {
    throw new Error('Failed to get file URL. Please try again.');
  }
};

/**
 * Tạo download URL - URLs already provided by backend
 */
export const getFileDownloadUrl = async (fileKey, expiresIn = 300) => {
  try {
    // Backend already provides presigned download URLs
    const response = await apiRequest('/files/role/salesperson');

    if (response.files) {
      const file = response.files.find(f => f.key === fileKey);
      if (file) {
        return file.downloadUrl;
      }
    }

    throw new Error('File not found');
  } catch (error) {
    throw new Error('Failed to get download URL. Please try again.');
  }
};
