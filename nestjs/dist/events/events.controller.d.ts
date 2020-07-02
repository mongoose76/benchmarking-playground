import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './event.model';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto): Promise<Event>;
}
