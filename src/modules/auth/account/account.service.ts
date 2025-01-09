import { PrismaService } from './../../../core/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
  public constructor(private readonly PrismaService: PrismaService) {}
  public async findAll() {
    const users = await this.PrismaService.user.findMany();

    return users;
  }
}
