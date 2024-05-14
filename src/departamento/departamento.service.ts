import { Injectable } from '@nestjs/common';

@Injectable()
export class DepartamentoService {
  constructor(
    private readonly dept_id: number,
    private readonly nombre: string,
  ) {}

  getNombre(): string {
    // Database conn
    return 'Ingeniería informática';
  }
}
