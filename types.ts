export interface Hymn {
  id: number;
  title: string;
  lyrics: string;
}

export interface ChoirMember {
  id: number;
  name: string;
  role: string;
}

// Added interface for YouTube videos
export interface ChoirVideo {
  id: number;
  title: string;
  link: string;
}

export interface SearchState {
  term: string;
  triggerHighlight: boolean;
}