import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { CORS } from "./constants";
import * as morgan from "morgan";
import { NestExpressApplication } from "@nestjs/platform-express";
import { json } from "express";
import { ExceptionsFilter } from "@tresdoce-nestjs-toolkit/filters";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const PORT = process.env.PORT || 8000;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const appConfig = app.get<ConfigService>(ConfigService)["internalConfig"]["config"];

  app.use(json({ limit: "500mb" }));

  app.use(morgan("dev"));

  app.enableCors(CORS);

  app.setGlobalPrefix("api/v1");

  app.useGlobalFilters(new ExceptionsFilter(appConfig));

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle("HealTrack API")
    .setDescription("Esta es la api de HealTrack")
    .setVersion("1.0")
    .addTag("users")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  await app.listen(PORT);

  console.log(`Server running on port ${PORT}`);
}
bootstrap();
