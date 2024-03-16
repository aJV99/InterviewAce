export interface UserDto {
  firstName: string;
  lastName: string;
  email: string;
  linkedInId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  email: string;
  linkedInId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
