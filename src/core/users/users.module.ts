import { Module } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DbValidatorsModule } from "@youba/nestjs-dbvalidator";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DbValidatorsModule.register({
      type: "postgres",
      host: configService.get("DATABASE_HOST"),
      port: configService.get("DATABASE_PORT"),
      username: configService.get("DATABASE_USERNAME"),
      password: configService.get("DATABASE_PASSWORD"),
      database: configService.get("DATABASE_NAME"),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
