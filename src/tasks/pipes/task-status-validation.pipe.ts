import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../tasks-statuses.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = Object.values(TaskStatus);

  transform(value: any) {
    value = value.toUpperCase();

    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" in a not valid status`);
    }
    return value;
  }

  private isStatusValid(status: any) {
    const idx = this.allowedStatuses.indexOf(status);
    return idx !== -1;
  }
}
