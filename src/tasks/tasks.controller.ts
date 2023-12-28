import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.entity';
import { ApiBody } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
// import { TaskStatus } from './tasks-statuses.enum';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { GetFilterTasksDto } from './dto/get-filter-tasks.dto';
// import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  // @Get()
  // getTasks(@Query(ValidationPipe) queryDto: GetFilterTasksDto): Task[] {
  //   if (Object.keys(queryDto).length) {
  //     return this.tasksService.getTasks(queryDto);
  //   } else return this.tasksService.getAllTasks();
  // }

  @Get('/:id')
  getSingleTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getSingleTask(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  // @Patch('/:id/status')
  // updateTaskStatus(
  //   @Param('id') id: string,
  //   @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  // ): Task {
  //   return this.tasksService.updateTaskStatus(id, status);
  // }

  // @Delete('/:id')
  // deleteSingleTask(@Param('id') id: string): void {
  //   return this.tasksService.deleteSingleTask(id);
  // }
}
