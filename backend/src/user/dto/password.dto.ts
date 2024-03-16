import { IsNotEmpty } from 'class-validator';

export class Password {
  @IsNotEmpty()
  currentPassword: string;

  @IsNotEmpty()
  newPassword: string;
}
