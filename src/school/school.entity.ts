import { ApiProperty } from '@nestjs/swagger';

export class School {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  division: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
