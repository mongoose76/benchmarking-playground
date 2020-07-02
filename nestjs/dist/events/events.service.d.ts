import { Event } from './event.model';
import { CreateEventDto } from './dto/create-event.dto';
export declare class EventsService {
    private eventModel;
    constructor(eventModel: typeof Event);
    create(createEventDto: CreateEventDto): Promise<Event>;
}
