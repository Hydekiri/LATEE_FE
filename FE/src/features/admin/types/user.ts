export interface User {
  userId: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  birthday: string;
  gender?: "Male" | "Female";
  address?: string;
  role: "Learner" | "Expert" | "Admin";
  status: "active" | "inactive";
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;

  profile?: ExpertProfile;
}

export interface ExpertProfile {
  id: string;
  ssn: string;
  bioQoute: string;
  educationDetail: string;
  titlePosition: string;
  expertiseSkill: string;
  socialLink: string;
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

export interface AdminDashboardStats {
  increase_user: number;
  total_learners: number;
  total_experts: number;
  total_admins: number;
  total_active_users: number;
}