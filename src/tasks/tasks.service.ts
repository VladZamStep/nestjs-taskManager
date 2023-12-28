import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-statuses.enum';
import { GetFilterTasksDto } from './dto/get-filter-tasks.dto';
// import { Task, TaskStatus } from './tasks.model';
// import { randomUUID } from 'crypto';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { GetFilterTasksDto } from './dto/get-filter-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: TaskRepository,
  ) {}

  async getSingleTask(id: number): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found.`);
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await this.taskRepository.save(task);
    return task;
  }

  async getAllTasks(queryDto: GetFilterTasksDto): Promise<Task[]> {
    const { status, search } = queryDto;
    const query = this.taskRepository.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
  // getTasks(queryDto: GetFilterTasksDto): Task[] {
  //   const { status, search } = queryDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       task.title.includes(search) || task.description.includes(search);
  //     });
  //   }
  //   return tasks;
  // }
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const foundTask = await this.getSingleTask(id);
    foundTask.status = status;
    await foundTask.save();
    return foundTask;
  }
  async deleteSingleTask(id: number): Promise<void> {
    const deletedTask = await this.taskRepository.delete(id);
    if (deletedTask.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found.`);
    }
  }
}
