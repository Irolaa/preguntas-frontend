import { doGet, doPut } from './http.service';
import { UserData } from '../pages/profile/types';
import {UserProgressResponse as UserProgress} from '../models/users.models';

export const getUserData = async(): Promise<UserData> => {
  const path = `/api/private/questions/collaborator/profile`;
  const response = await doGet<UserData>(path);
  return response;
};

export const updateUserProfile = async (data: UserData): Promise<UserData> => {
  const path = `/api/private/questions/collaborator/profile`;
  const response = await doPut<UserData, UserData>(data, path);
  return response;
};

export const updatePassword = async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
  const path = `/api/private/questions/collaborator/change-password`;
  await doPut<typeof data, void>(data, path);
};

export const getUserProgress = async (id: string): Promise<UserProgress> => {
  const encodedTerm = encodeURIComponent(id);
  const path = `/api/private/questions/progress/${encodedTerm}`;;
  const response = await doGet<UserProgress>(path);
  return response;
};