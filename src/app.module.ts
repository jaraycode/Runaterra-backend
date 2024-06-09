import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseInterceptor } from "@tresdoce-nestjs-toolkit/response-parser";
import { ConfigModule, ConfigService } from "@nestjs/config";
import typeorm from "./config/typeorm";
import { UsersModule } from "./core/users/users.module";
import { AuthModule } from "./core/auth/auth.module";
import { DptosModule } from "./core/dptos/dptos.module";
import { IndicatorsModule } from "./core/indicators/indicators.module";
import { CategoriesModule } from "./core/categories/categories.module";
import { CriteriaModule } from "./core/criteria/criteria.module";
import { ContributionsModule } from "./core/contributions/contributions.module";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static/dist/serve-static.module";
import { FilesModule } from "./core/files/files.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => configService.get("typeorm"),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "../public"),
      serveRoot: "/public/",
    }),
    UsersModule,
    AuthModule,
    DptosModule,
    IndicatorsModule,
    CategoriesModule,
    CriteriaModule,
    ContributionsModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
