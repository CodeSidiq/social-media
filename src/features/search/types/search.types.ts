// src/features/search/types/search.types.ts

export type SearchValidationIssueDto = {
  type: string;
  value: string;
  msg: string;
  path: string;
  location: string;
};

export type SearchUserDto = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
};

export type SearchUsersResponseDto = {
  users: SearchUserDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type SearchUsersApiResponseDto =
  | {
      success: true;
      message: string;
      data: SearchUsersResponseDto;
    }
  | {
      success: false;
      message: string;
      data: SearchValidationIssueDto[] | null;
    };

export type SearchUserItem = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
};

export type SearchUsersResult = {
  users: SearchUserItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
