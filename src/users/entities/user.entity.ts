import bcrypt from 'bcryptjs';

export class User {
  constructor(
    private readonly nombre: string,
    private readonly correo: string,
    private readonly rol: 'admin' | 'dpto' | 'salcedo',
    private readonly fecha_nacimiento: Date,
    private readonly password: string,
    private readonly user_id?: number,
  ) {}

  private async stringToHash(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
