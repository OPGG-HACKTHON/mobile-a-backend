import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Region } from '@prisma/client';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  async getRegions(): Promise<Region[]> {
    return await this.prisma.region.findMany();
  }

  async getRegionById(id: number): Promise<Region> {
    return await this.prisma.region.findUnique({
      where: {
        id: id,
      },
    });
  }
}
