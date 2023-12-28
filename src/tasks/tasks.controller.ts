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
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './tasks-statuses.enum';
import { GetFilterTasksDto } from './dto/get-filter-tasks.dto';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { GetFilterTasksDto } from './dto/get-filter-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getTasks(
    @Query(ValidationPipe) queryDto: GetFilterTasksDto,
  ): Promise<Task[]> {
    return this.tasksService.getAllTasks(queryDto);
  }

  @Get('/:id')
  getSingleTask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getSingleTask(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status);
  }

  @Delete('/:id')
  deleteSingleTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.tasksService.deleteSingleTask(id);
  }
}
