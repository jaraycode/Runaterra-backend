import { Controller, Get } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';

@Controller('departamento')
export class DepartamentoController {
  constructor(private readonly DptoService: DepartamentoService) {}

  @Get()
  getNombre(): string {
    return this.DptoService.getNombre();
  }
}
