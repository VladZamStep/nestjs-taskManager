import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'test_db',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
};
