// src/types/entities/user.ts

export type UserEntity = {
  id: number;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  createdAt?: string;
};
