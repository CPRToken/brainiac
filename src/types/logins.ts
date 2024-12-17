// src/types.ts
export interface LoginEvent {
  id: string;
  createdAt: number;
  ip: string;
  type: string;
  userAgent: string;
}
