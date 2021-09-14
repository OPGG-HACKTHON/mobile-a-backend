import { ApiProperty } from '@nestjs/swagger';

export enum TitleStatus {
  GET = 'GET',
  LOSE = 'LOSE',
}

export class TitleLogDTO {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fromLOLNickName: string;

  @ApiProperty()
  exposureName: string;

  @ApiProperty({ enum: TitleStatus, description: 'get or lose status' })
  titleStatus: TitleStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  logValue: string;
}
