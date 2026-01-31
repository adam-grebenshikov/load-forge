import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { config as sharedConfig } from "@loadforge/config";

import { AppController } from "./app.controller";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => ({ ...sharedConfig })],
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
