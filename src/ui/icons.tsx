import React from "react";

export const Icon: Record<string, React.FC<{ size?: number }>> = {
  // Tone personas
  bucky: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="#1e1e1e" strokeWidth="2"/>
      <circle cx="12" cy="12" r="4" stroke="#1e1e1e" strokeWidth="2"/>
      <circle cx="12" cy="12" r="1.5" fill="#1e1e1e"/>
    </svg>
  ),
  saira: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21s-6-3.5-6-8.5S9 5 12 8c3-3 6 .5 6 4.5S12 21 12 21Z" fill="#ffb959" stroke="#1e1e1e" strokeWidth="1.5"/>
    </svg>
  ),
  ari: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12c4-4 12-4 16 0" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 16c3-3 9-3 12 0" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  hai: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v18M5 10l7-7 7 7" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  zi: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#1e1e1e" strokeWidth="2"/>
      <path d="M8 12h8" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  taylor: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7h10l2 4H5l2-4Z" stroke="#1e1e1e" strokeWidth="2"/>
      <path d="M6 11h12v6H6z" stroke="#1e1e1e" strokeWidth="2"/>
    </svg>
  ),

  // Vibes
  cozy: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 9h10a2 2 0 0 1 0 4H6V9Z" stroke="#1e1e1e" strokeWidth="2"/>
      <path d="M4 13v2a3 3 0 0 0 3 3h7" stroke="#1e1e1e" strokeWidth="2"/>
    </svg>
  ),
  chic: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6Z" stroke="#1e1e1e" strokeWidth="2"/>
    </svg>
  ),
  minimalist: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="12" height="12" stroke="#1e1e1e" strokeWidth="2"/>
    </svg>
  ),
  quiet: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 9l6-6v18l-6-6H3V9h2Z" stroke="#1e1e1e" strokeWidth="2"/>
      <path d="M16 9v6" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  crowded: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2.5" stroke="#1e1e1e" strokeWidth="2"/>
      <circle cx="16" cy="9" r="2.5" stroke="#1e1e1e" strokeWidth="2"/>
      <circle cx="10" cy="15" r="2.5" stroke="#1e1e1e" strokeWidth="2"/>
    </svg>
  ),
  not_busy: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="7" stroke="#1e1e1e" strokeWidth="2"/>
      <path d="M9 12h6" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  airy: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 10c4-2 8-2 12 0" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round"/>
      <path d="M6 14c3-1.5 6-1.5 9 0" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  study: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7h16v10H4z" stroke="#1e1e1e" strokeWidth="2"/>
      <path d="M8 7v10" stroke="#1e1e1e" strokeWidth="2"/>
    </svg>
  ),
  colorful: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" stroke="#1e1e1e" strokeWidth="2"/>
      <circle cx="9" cy="10" r="1.5" fill="#ffb959"/>
      <circle cx="15" cy="10" r="1.5" fill="#75b3ff"/>
      <circle cx="12" cy="15" r="1.5" fill="#ffd966"/>
    </svg>
  ),
  artsy: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 16c0-2.5 2-4.5 4.5-4.5h3A4.5 4.5 0 0 1 18 16c0 2-1.5 3-3.5 3H9.5C7.5 19 6 18 6 16Z" stroke="#1e1e1e" strokeWidth="2"/>
      <path d="M16 7l2 2" stroke="#1e1e1e" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  // Mood icons (colorful)
  moodHappy: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="#FFD166"/>
      <circle cx="9" cy="10" r="1" fill="#1e1e1e"/>
      <circle cx="15" cy="10" r="1" fill="#1e1e1e"/>
      <path d="M8.5 14c1 .9 2.2 1.4 3.5 1.4S14.5 14.9 15.5 14" stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  moodMeh: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="16" height="16" rx="5" fill="#CFCFF5"/>
      <circle cx="9" cy="11" r="1" fill="#1e1e1e"/>
      <circle cx="15" cy="11" r="1" fill="#1e1e1e"/>
      <path d="M8.5 15h7" stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  moodSad: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3c3.5 3.6 7 6.8 7 10.3A7 7 0 1 1 5 13.3C5 9.8 8.5 6.6 12 3Z" fill="#8EC9FF"/>
      <circle cx="9" cy="12" r="1" fill="#1e1e1e"/>
      <circle cx="15" cy="12" r="1" fill="#1e1e1e"/>
      <path d="M8.5 16c1-.9 2.2-1.4 3.5-1.4S14.5 15.1 15.5 16" stroke="#1e1e1e" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  ),
  moodMildSad: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 14.5A3.5 3.5 0 0 1 11 11h2a3.5 3.5 0 0 1 3.5 3.5c0 1.9-1.6 3.5-3.5 3.5H11c-1.9 0-3.5-1.6-3.5-3.5Z" fill="#DCC6FF"/>
      <circle cx="9.5" cy="13.5" r=".8" fill="#1e1e1e"/>
      <circle cx="14.5" cy="13.5" r=".8" fill="#1e1e1e"/>
      <path d="M10 16.5h4" stroke="#1e1e1e" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),
  moodChill: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 14c3-3 11-3 14 0-1.2 3.3-4.2 5-7 5s-5.8-1.7-7-5Z" fill="#BDF4E4"/>
      <path d="M6.5 14.5c2-1.4 9-1.4 11 0" stroke="#1e1e1e" strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  ),

  // Mode icons
  modeSolo: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="3.5" fill="#FFD166" stroke="#1e1e1e" strokeWidth="1"/>
      <path d="M6.5 19c1.2-2.7 3.1-4 5.5-4s4.3 1.3 5.5 4" fill="#BDE0FE" stroke="#1e1e1e" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),
  modeTogether: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8" r="3" fill="#FFADAD" stroke="#1e1e1e" strokeWidth="1"/>
      <circle cx="15.5" cy="8" r="3" fill="#9BF6FF" stroke="#1e1e1e" strokeWidth="1"/>
      <path d="M3.5 19c.9-2.5 2.7-3.8 5-3.8 2.4 0 3.2.6 3.5 1 .3-.4 1.1-1 3.5-1 2.3 0 4.1 1.3 5 3.8" fill="#E6F5D7" stroke="#1e1e1e" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  ),

  // Utility icons
  clock: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" fill="#FFE08A" stroke="#1e1e1e" strokeWidth="1.2"/>
      <path d="M12 7v5l3 2" stroke="#1e1e1e" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  shirt: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5l4 2 4-2 3 3-3 2v9H8V10L5 8l3-3Z" fill="#CDE7FF" stroke="#1e1e1e" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  ),
  sparkle: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3l1.7 3.8L18 8.5l-3.5 1.2L12 13l-2.5-3.3L6 8.5l4.3-1.7L12 3Z" fill="#BDF4E4" stroke="#1e1e1e" strokeWidth="1.2"/>
    </svg>
  ),
};



