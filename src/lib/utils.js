/**
 * Format duration from seconds to mm:ss
 */
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format duration from seconds to hh:mm:ss (for longer content)
 */
export const formatLongDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const then = new Date(date);
  const diffInSeconds = Math.floor((now - then) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 604800)} weeks ago`;

  return then.toLocaleDateString();
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength = 50) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Premium gradient palettes for cover generation
 */
const GRADIENT_PALETTES = [
  // Purple/Pink vibes
  { start: "#667eea", end: "#764ba2" },
  { start: "#f093fb", end: "#f5576c" },
  { start: "#4facfe", end: "#00f2fe" },
  // Nature tones
  { start: "#11998e", end: "#38ef7d" },
  { start: "#36d1dc", end: "#5b86e5" },
  { start: "#ed6ea0", end: "#ec8c69" },
  // Deep tones
  { start: "#8e2de2", end: "#4a00e0" },
  { start: "#fc466b", end: "#3f5efb" },
  { start: "#00c6ff", end: "#0072ff" },
  // Warm tones
  { start: "#f7971e", end: "#ffd200" },
  { start: "#ff416c", end: "#ff4b2b" },
  { start: "#654ea3", end: "#eaafc8" },
];

/**
 * Get a consistent gradient based on text (same text = same gradient)
 */
export const getGradientForText = (text = "Music") => {
  // Generate a hash from the text
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % GRADIENT_PALETTES.length;
  return GRADIENT_PALETTES[index];
};

/**
 * Get placeholder cover - returns a data object for component use
 * Instead of an image URL, we return gradient info
 */
export const getPlaceholderCover = (text = "Music") => {
  // Return null so components use the gradient fallback
  return null;
};

/**
 * Get gradient style for placeholder
 */
export const getPlaceholderGradient = (text = "Music") => {
  const palette = getGradientForText(text);
  return `linear-gradient(135deg, ${palette.start} 0%, ${palette.end} 100%)`;
};

/**
 * Get initials from text (max 2 characters)
 */
export const getInitials = (text = "") => {
  if (!text) return "♪";
  const words = text.split(" ").filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return text.substring(0, 2).toUpperCase();
};

/**
 * Generate a random color for placeholder covers
 */
export const getRandomGradient = () => {
  const gradients = [
    "from-purple-500 to-pink-500",
    "from-cyan-500 to-blue-500",
    "from-green-500 to-teal-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-indigo-500 to-purple-500",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Classname helper (like clsx/classnames)
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};
