import { Module } from "@nestjs/common";
import { DptosService } from "./services/dptos.service";
import { DptosController } from "./dptos.controller";
import { envData } from "@src/config/typeorm";
import { DbValidatorsModule } from "@youba/nestjs-dbvalidator";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Dpto } from "./entities/dpto.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Dpto]),
    DbValidatorsModule.register({
      type: "postgres",
      host: envData.DATABASE_HOST,
      port: parseInt(envData.DATABASE_PORT),
      username: envData.DATABASE_USERNAME,
      password: envData.DATABASE_PASSWORD,
      database: envData.DATABASE_NAME,
    }),
  ],
  controllers: [DptosController],
  providers: [DptosService],
})
export class DptosModule {}
