import { httpApi } from '@app/api/http.api';

export interface ProfileResponse {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export const Profile: () => Promise<any> = () => httpApi.get<ProfileResponse>('users/me').then(({ data }) => data);
