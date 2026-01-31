import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { FastifyReply, FastifyRequest } from "fastify";

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const problem: ProblemDetails = {
      type: `https://httpstatus.es/${status}`,
      title: HttpStatus[status] ?? "Error",
      status,
      instance: req.url,
    };

    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      if (typeof body === "object" && body !== null) {
        const b = body as Record<string, unknown>;
        problem.detail = Array.isArray(b.message)
          ? (b.message as string[]).join("; ")
          : (b.message as string);
        const first = Array.isArray(b.message) ? b.message[0] : null;
        if (first && typeof first === "object" && "constraints" in first) {
          problem.detail = "Validation failed";
          problem.errors = this.toErrors(
            b.message as Array<{
              property: string;
              constraints?: Record<string, string>;
            }>,
          );
        }
      } else {
        problem.detail = String(body);
      }
    } else {
      problem.detail =
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : exception instanceof Error
            ? exception.message
            : "Unknown error";
      if (exception instanceof Error && exception.stack) {
        this.logger.error(exception.stack);
      }
    }

    res
      .status(status)
      .header("Content-Type", "application/problem+json")
      .send(problem);
  }

  private toErrors(
    list: Array<{ property: string; constraints?: Record<string, string> }>,
  ): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const e of list) {
      if (e.constraints) out[e.property] = Object.values(e.constraints);
    }
    return out;
  }
}
