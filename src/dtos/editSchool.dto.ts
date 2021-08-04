import { ApiProperty } from '@nestjs/swagger';

export class EditSchoolDto {
  @ApiProperty()
  public school: string;
}
