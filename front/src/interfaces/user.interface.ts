export type getProfile = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
  isEmailVerified: boolean;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
};

export type getProfileResponse = {
  success: boolean;
  payload: getProfile;
};

type ErrorItem = {
  path: string
  message: string
}
export type UserProfileErrorResponse = {
  success: boolean
  payload: ErrorItem | ErrorItem[];
}
