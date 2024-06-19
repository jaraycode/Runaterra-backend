import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CORS } from "./constants";
import * as morgan from "morgan";
import * as fs from "fs";
import * as path from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import express, { json } from "express";
import { ExceptionsFilter } from "@tresdoce-nestjs-toolkit/filters";
import { ConfigService } from "@nestjs/config";
import { FormdataInterceptor, DefaultFileSaver } from "nestjs-formdata-interceptor";
import * as multer from "multer";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const PORT = process.env.PORT || 8000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const appConfig = app.get<ConfigService>(ConfigService)["internalConfig"]["config"];

  app.use(json({ limit: "500mb" }));

  app.use(morgan("dev"));

  app.enableCors(CORS);

  app.setGlobalPrefix("api/v1");

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new ExceptionsFilter(appConfig));

  const publicDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  app.useStaticAssets(path.join(__dirname, "..", "public"), {
    prefix: "/public",
  });

  app.useGlobalInterceptors(
    new FormdataInterceptor({
      customFileName(context, originalFileName) {
        return `${Date.now()}-${originalFileName}`;
      },
      fileSaver: new DefaultFileSaver({
        prefixDirectory: "./public",
        customDirectory(context, originalDirectory) {
          return originalDirectory;
        },
      }),
    }),
  );

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("Green Metrics API")
    .setDescription("Esta es la api de Green Metrics")
    .setVersion("1.0")
    .addTag("users")
    .addTag("departments")
    .addTag("indicators")
    .addTag("categories")
    .addTag("criteria")
    .addTag("files")
    .addTag("auth")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(PORT);

  console.log(`Server running on port ${PORT}`);
}
bootstrap();
