import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateOrganizationInput } from './graphql/inputs/create-organization.input';

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async createOrganization(input: CreateOrganizationInput, prisma = null) {
    const prismaClient = prisma || this.prisma;
    const newOrganization = await prismaClient.organization.create({
      data: {
        ...input,
      },
    });

    return newOrganization;
  }
}
