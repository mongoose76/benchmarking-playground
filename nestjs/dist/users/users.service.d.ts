import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: typeof User);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    remove(id: string): Promise<void>;
}
