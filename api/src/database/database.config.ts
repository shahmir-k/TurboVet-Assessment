import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User, Organization, Task, AuditLog } from './entities';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const dbType = process.env['DB_TYPE'] || 'sqlite';

  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: process.env['DB_HOST'] || 'localhost',
      port: parseInt(process.env['DB_PORT'] || '5432'),
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE'],
      entities: [User, Organization, Task, AuditLog],
      synchronize: true, // Set to false in production
      logging: false,
    };
  }

  // SQLite configuration (default)
  return {
    type: 'sqlite',
    database: process.env['DB_DATABASE'] || 'turbovet.db',
    entities: [User, Organization, Task, AuditLog],
    synchronize: true,
    logging: false,
  };
};

