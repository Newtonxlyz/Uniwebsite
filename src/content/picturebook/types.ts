export interface Character {
  id: string;
  name: string;
  name_en: string;
  species: string;
  species_en: string;
  role: string;
  role_en: string;
  key_features: string;
  description: string;
  personality: string;
  color: string;
  emoji: string;
  storyCount: number;
}

export interface Series {
  id: string;
  name: string;
  name_en: string;
  count: number;
  description: string;
  color: string;
  bg: string;
  priority: number;
  image_emoji: string;
}

export interface StoryPage {
  page_number: number;
  text: string;
  text_en?: string;
  image_url?: string;
  audio_url?: string;
}

export interface Story {
  id: string;
  title: string;
  title_en?: string;
  series_id: string;
  characters: string[];
  tags: string[];
  age_range: string;
  reading_time: number;
  pages: StoryPage[];
  description: string;
  education_value?: string;
  emotion_focus?: string;
  status: "draft" | "illustrated" | "published";
  created_at: string;
}
