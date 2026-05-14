export interface User {
  userId: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birthday: string;
  gender?: string;
  address?: string;
  role: "Learner" | "Expert" | "Admin";
  status: "active" | "inactive";
  avatar_url?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserUpdate {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  birthday: string;
  gender: string;
  address: string;
  status: string;
}

export interface CreateUserRequest {
  userId: string,
  name: string,
  email: string,
  password: string,
  phone: string | null,
  birthday: string,
  gender: string,
  address: string | null,
  status: string,
  role: string
}