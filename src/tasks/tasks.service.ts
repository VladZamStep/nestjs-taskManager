import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-statuses.enum';
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

  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
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
  // getSingleTask(id: string) {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) throw new NotFoundException(`Task with ID ${id} not found.`);
  //   return found;
  // }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const newTask = {
  //     id: randomUUID(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(newTask);
  //   return newTask;
  // }
  // updateTaskStatus(id: string, status: TaskStatus): Task {
  //   const foundTask = this.getSingleTask(id);
  //   foundTask.status = status;
  //   return foundTask;
  // }
  // deleteSingleTask(id: string): void {
  //   const found = this.getSingleTask(id);
  //   const foundIndex = this.tasks.indexOf(found);
  //   this.tasks.splice(foundIndex, 1);
  // }
}
