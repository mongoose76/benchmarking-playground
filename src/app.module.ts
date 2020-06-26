import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { UsersModule } from './users/users.module';
import { EventsController } from './events/events.controller';
import { EventsModule } from './events/events.module';
import { Event } from './events/event.model';

@Module({
  imports: [SequelizeModule.forRoot({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'jackpot',
    models: [User, Event],
  }), UsersModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
