import { Module } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { envData } from "@src/config/typeorm";

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: envData.SECRET,
      signOptions: { expiresIn: "31d" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
