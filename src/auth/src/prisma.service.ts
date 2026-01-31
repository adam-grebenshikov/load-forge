import { Injectable } from "@nestjs/common";

import {
  type PrismaClient as PrismaClientType,
  PrismaClient,
} from "@loadforge/database";

import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "@loadforge/config";

@Injectable()
export class PrismaService extends PrismaClient implements PrismaClientType {
  constructor() {
    const adapter = new PrismaPg({ connectionString: config.DATABASE_URL });
    super({ adapter });
  }
}
