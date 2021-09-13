import { ApiProperty } from '@nestjs/swagger';
// { enum: AuthFrom, description: 'google or apple' }

export enum LOLTierParam {
  DIAMOND = 'DIAMOND',
  PLATINUM = 'PLATINUM',
  GOLD = 'GOLD',
  SILVER = 'SILVER',
  BRONZE = 'BRONZE',
  IRON = 'IRON',
}

export class SignUpRandomParam {
  @ApiProperty()
  public schoolId: string;

  @ApiProperty({
    required: false,
    enum: LOLTierParam,
    description: '생성할 유저의 티어',
  })
  public tier?: LOLTierParam;
}
