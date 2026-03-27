// src/features/auth/api/auth.api.ts

import type {
  LoginRequestDto,
  LoginResponseDto,
  MeRawResponseDto,
  MeResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
} from '@/features/auth/types/auth.dto';
import { api } from '@/lib/api';

export const authApi = {
  register: async (payload: RegisterRequestDto) => {
    const response = await api.post<RegisterResponseDto>(
      '/api/auth/register',
      payload
    );

    return response.data;
  },

  login: async (payload: LoginRequestDto) => {
    const response = await api.post<LoginResponseDto>(
      '/api/auth/login',
      payload
    );

    return response.data;
  },

  getMe: async (): Promise<MeResponseDto> => {
    const response = await api.get<MeRawResponseDto>('/api/me');
    const payload = response.data;

    if (!payload.success || !payload.data) {
      return payload;
    }

    return {
      success: true,
      message: payload.message,
      data: payload.data.profile,
    };
  },
};
