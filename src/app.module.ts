import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartamentoService } from './departamento/departamento.service';
import { DepartamentoController } from './departamento/departamento.controller';

@Module({
  imports: [],
  controllers: [AppController, DepartamentoController],
  providers: [AppService, DepartamentoService],
})
export class AppModule {}
