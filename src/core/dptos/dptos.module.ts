import { Module } from "@nestjs/common";
import { DptosService } from "./services/dptos.service";
import { DptosController } from "./dptos.controller";
import { DbValidatorsModule } from "@youba/nestjs-dbvalidator";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dpto } from "./entities/dpto.entity";
import { ConfigService } from "nestjs-config";

const configService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forFeature([Dpto]),
    DbValidatorsModule.register({
      type: "postgres",
      host: configService.get("DATABASE_HOST"),
      port: configService.get("DATABASE_PORT"),
      username: configService.get("DATABASE_USERNAME"),
      password: configService.get("DATABASE_PASSWORD"),
      database: configService.get("DATABASE_NAME"),
    }),
  ],
  controllers: [DptosController],
  providers: [DptosService],
})
export class DptosModule {}
