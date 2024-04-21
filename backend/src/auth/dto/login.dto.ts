export class LoginDtoEmail {
  email: string;
  password: string;
}

export class LoginDtoId {
  id: string;
  password: string;
}

export class ForgotPasswordDto {
  email: string;
}

export class ResetPasswordDto {
  email: string;
  token: string;
  password: string;
}
