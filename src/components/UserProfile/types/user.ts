export interface Activity {
  type: "project" | "comment" | "update";
  title: string;
  desc: string;
  time: string;
  icon: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatar: string;
  location: string;
  timezone: string;
  joined: string;
  bio: string;
  phone: string;
  website: string;
  github: string;
  linkedin: string;
  skills: string[];
  languages: string[];
  activity: Activity[];
}

export interface UserPreferences {
  emailNotifs: boolean;
  pushNotifs: boolean;
  weeklyDigest: boolean;
  marketingEmails: boolean;
}
