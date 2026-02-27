// Dummy data for playlists and setlists

export const playlists = [
  {
    id: 1,
    name: "Summer Vibes",
    description: "Perfect tracks for outdoor gigs",
    songs: [
      { id: 101, title: "Sunset Boulevard", artist: "The Groove Makers", duration: "3:45", bpm: 120, key: "C Major" },
      { id: 102, title: "Ocean Breeze", artist: "Coastal Sound", duration: "4:12", bpm: 115, key: "G Major" },
      { id: 103, title: "Beach Party", artist: "DJ Wavez", duration: "3:30", bpm: 128, key: "D Minor" },
      { id: 104, title: "Golden Hour", artist: "The Sunset Collective", duration: "4:00", bpm: 110, key: "A Major" },
      { id: 105, title: "Tropical Nights", artist: "Island Rhythms", duration: "3:55", bpm: 122, key: "E Major" }
    ]
  },
  {
    id: 2,
    name: "Rock Classics",
    description: "Timeless rock anthems",
    songs: [
      { id: 201, title: "Electric Thunder", artist: "The Voltage", duration: "5:20", bpm: 140, key: "E Minor" },
      { id: 202, title: "Highway Dreams", artist: "Road Warriors", duration: "4:45", bpm: 135, key: "A Minor" },
      { id: 203, title: "Rebel Heart", artist: "The Outlaws", duration: "4:30", bpm: 130, key: "D Major" },
      { id: 204, title: "Thunder Strike", artist: "Storm Chasers", duration: "5:00", bpm: 145, key: "B Minor" },
      { id: 205, title: "Power Chord", artist: "Amp'd Up", duration: "3:40", bpm: 138, key: "G Major" }
    ]
  },
  {
    id: 3,
    name: "Jazz Standards",
    description: "Smooth jazz for upscale venues",
    songs: [
      { id: 301, title: "Midnight in Manhattan", artist: "The Blue Notes", duration: "6:15", bpm: 85, key: "F Major" },
      { id: 302, title: "Velvet Lounge", artist: "Smooth Operators", duration: "5:30", bpm: 90, key: "Bb Major" },
      { id: 303, title: "Moonlight Serenade", artist: "The Night Owls", duration: "5:45", bpm: 80, key: "Eb Major" },
      { id: 304, title: "Urban Sophistication", artist: "City Lights Trio", duration: "6:00", bpm: 88, key: "Ab Major" },
      { id: 305, title: "After Hours", artist: "Late Night Sessions", duration: "7:10", bpm: 75, key: "C Minor" }
    ]
  },
  {
    id: 4,
    name: "Electronic Dance",
    description: "High-energy club bangers",
    songs: [
      { id: 401, title: "Neon Pulse", artist: "Synthwave Dreams", duration: "3:25", bpm: 128, key: "A Minor" },
      { id: 402, title: "Digital Love", artist: "Cyber Beats", duration: "4:15", bpm: 130, key: "D Minor" },
      { id: 403, title: "Rave Nation", artist: "Bass Drop", duration: "3:50", bpm: 140, key: "G Minor" },
      { id: 404, title: "Laser Lights", artist: "Techno Tribe", duration: "4:30", bpm: 135, key: "E Minor" },
      { id: 405, title: "Circuit Breaker", artist: "Electric Pulse", duration: "3:35", bpm: 132, key: "B Minor" }
    ]
  },
  {
    id: 5,
    name: "Acoustic Chill",
    description: "Mellow acoustic sets",
    songs: [
      { id: 501, title: "Coffee Shop Mornings", artist: "Acoustic Soul", duration: "3:20", bpm: 95, key: "C Major" },
      { id: 502, title: "Rainy Day Reflections", artist: "The Strummers", duration: "4:05", bpm: 88, key: "G Major" },
      { id: 503, title: "Fireside Stories", artist: "Folk Tales", duration: "3:45", bpm: 92, key: "D Major" },
      { id: 504, title: "Peaceful Mind", artist: "Zen Guitars", duration: "4:30", bpm: 85, key: "A Major" },
      { id: 505, title: "Sunday Afternoon", artist: "Laid Back Collective", duration: "3:55", bpm: 90, key: "E Major" }
    ]
  }
];

export const setlists = [
  {
    id: 1,
    name: "Beach Bar Opening Set",
    description: "Upbeat set to kick off the evening",
    playlistId: 1,
    date: "2026-06-15",
    venue: "Sunset Beach Bar",
    songs: [
      { songId: 101, notes: "Start strong with this opener" },
      { songId: 103, notes: "Build energy here" },
      { songId: 105, notes: "Close with tropical vibes" }
    ]
  },
  {
    id: 2,
    name: "Rock Night Headliner",
    description: "High-energy rock set for main stage",
    playlistId: 2,
    date: "2026-07-20",
    venue: "The Rock Vault",
    songs: [
      { songId: 201, notes: "Epic opener - full stage lights" },
      { songId: 203, notes: "Crowd favorite, encourage singalong" },
      { songId: 204, notes: "Finale with extended solo" }
    ]
  },
  {
    id: 3,
    name: "Late Night Jazz Club",
    description: "Intimate late-night jazz session",
    playlistId: 3,
    date: "2026-08-05",
    venue: "Blue Moon Jazz Club",
    songs: [
      { songId: 301, notes: "Set the mood with this classic" },
      { songId: 302, notes: "Keep it smooth and mellow" },
      { songId: 305, notes: "Perfect closer for late night" }
    ]
  }
];
