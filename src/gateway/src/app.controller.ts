import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("app")
@Controller()
export class AppController {
  @Get("health")
  @ApiOperation({ summary: "Health check" })
  health() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("ping")
  @ApiOperation({ summary: "Ping" })
  ping() {
    return { pong: true, timestamp: new Date().toISOString() };
  }
}
