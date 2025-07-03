export interface UserRegisterRequest {
	username: string;
	email: string;
	password: string;
}

export type AuthenticationResponse = {
	token: string;
};

export type AuthenticationInput = {
	username: string;
	password: string;
};

export interface GetUserDataResponse {
	username: string;
	email: string;
	profileImage: string;
	password: string;
}
export interface UserProgressResponse {
 xp: number;
  rank: string;
  nextRank: string;
  progress: number;
  lastActivity: string;
  dailyStreak: number;
}
