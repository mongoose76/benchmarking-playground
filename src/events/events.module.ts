import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Event } from './event.model';
import { EventsController } from './events.controller';

@Module({
  imports: [SequelizeModule.forFeature([Event])],
  providers: [EventsService],
  controllers: [EventsController],
})
export class EventsModule {}
