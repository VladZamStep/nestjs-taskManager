import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-statuses.enum';
import { GetFilterTasksDto } from './dto/get-filter-tasks.dto';
import { User } from 'src/auth/auth.entity';
// import { Task, TaskStatus } from './tasks.model';
// import { randomUUID } from 'crypto';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { GetFilterTasksDto } from './dto/get-filter-tasks.dto';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getSingleTask(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: {
        id,
        userId: user.id,
      },
    });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found.`);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await this.taskRepository.save(task);
    } catch (err) {
      this.logger.error(
        `Failed to create task for user "${user.username}", Data: ${createTaskDto}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
    delete task.user;
    return task;
  }

  async getAllTasks(queryDto: GetFilterTasksDto, user: User): Promise<Task[]> {
    const { status, search } = queryDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}", Queries: ${queryDto}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const foundTask = await this.getSingleTask(id, user);
    foundTask.status = status;
    await foundTask.save();
    return foundTask;
  }
  async deleteSingleTask(id: number, user: User): Promise<void> {
    const deletedTask = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    if (deletedTask.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
  }
}
