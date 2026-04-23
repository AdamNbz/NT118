import { apiClient } from './apiClient';

export interface UserProfileDTO {
  id: number;
  email: string;
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  role: string;
}

export interface UserAddressDTO {
  id: number;
  userId: number;
  recipientName: string;
  recipientPhone: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  isDefault: boolean;
  latitude?: number | null;
  longitude?: number | null;
  poiName?: string | null;
  formattedAddress?: string | null;
}

export interface UpdateProfileRequest {
  name: string;
  phone?: string;
  avatarUrl?: string;
  gender?: string;
  dateOfBirth?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export const userApi = {
  // --- Profile ---
  getProfile: async (): Promise<UserProfileDTO> => {
    const res = await apiClient.get('/api/user/profile');
    return res.data?.data || res.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<void> => {
    await apiClient.put('/api/user/profile', data);
  },

  // --- Security ---
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.put('/api/user/password', data);
  },

  // --- Addresses ---
  getAddresses: async (): Promise<UserAddressDTO[]> => {
    const res = await apiClient.get('/api/user/addresses');
    return res.data?.data || res.data || [];
  },

  addAddress: async (data: Omit<UserAddressDTO, 'id' | 'userId'>): Promise<UserAddressDTO> => {
    const res = await apiClient.post('/api/user/addresses', data);
    return res.data?.data || res.data;
  },

  updateAddress: async (id: number, data: Partial<UserAddressDTO>): Promise<void> => {
    await apiClient.put(`/api/user/addresses/${id}`, data);
  },

  deleteAddress: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/user/addresses/${id}`);
  },
};
