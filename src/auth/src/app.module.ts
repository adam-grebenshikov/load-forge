import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config as loadforgeConfig } from "@loadforge/config";

import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ({ ...loadforgeConfig })],
      envFilePath: [".env.local", ".env"],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
