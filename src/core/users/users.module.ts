import { Module } from "@nestjs/common";
import { UsersService } from "./service/users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { DbValidatorsModule } from "@youba/nestjs-dbvalidator";
import { envData } from "@src/config/typeorm";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DbValidatorsModule.register({
      type: "postgres",
      host: envData.DATABASE_HOST,
      port: parseInt(envData.DATABASE_PORT),
      username: envData.DATABASE_USERNAME,
      password: envData.DATABASE_PASSWORD,
      database: envData.DATABASE_NAME,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
