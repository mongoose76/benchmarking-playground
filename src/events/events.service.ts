import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Event } from './event.model';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
    constructor(
        @InjectModel(Event)
        private eventModel: typeof Event,
      ) {}
    
      create(createEventDto: CreateEventDto): Promise<Event> {
        const event = new Event();
        event.type = createEventDto.type;
        event.value = createEventDto.value;
    
        return event.save();
      }
}
