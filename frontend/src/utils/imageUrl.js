// Helper utility to safely format and resolve uploaded image URLs with fallback handling

export const DEFAULT_FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80';

export const formatImageUrl = (url) => {
  if (!url || typeof url !== 'string') return DEFAULT_FALLBACK_IMAGE;

  // Handle Unsplash or external HTTP/HTTPS URLs
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If it contains local server uploads path, convert to relative /uploads/
    if (url.includes('/uploads/')) {
      const parts = url.split('/uploads/');
      return `/uploads/${parts[1]}`;
    }
    return url;
  }

  // Handle relative paths
  if (url.startsWith('/')) {
    return url;
  }

  return `/uploads/${url}`;
};

export const handleImageError = (e) => {
  if (e.target && e.target.src !== DEFAULT_FALLBACK_IMAGE) {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = DEFAULT_FALLBACK_IMAGE;
  }
};
