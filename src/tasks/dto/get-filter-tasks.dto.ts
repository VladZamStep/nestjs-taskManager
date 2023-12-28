import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../tasks-statuses.enum';

export class GetFilterTasksDto {
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
