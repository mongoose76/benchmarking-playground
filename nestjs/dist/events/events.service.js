"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const event_model_1 = require("./event.model");
let EventsService = class EventsService {
    constructor(eventModel) {
        this.eventModel = eventModel;
    }
    create(createEventDto) {
        const event = new event_model_1.Event();
        event.type = createEventDto.type;
        event.value = createEventDto.value;
        return event.save();
    }
};
EventsService = __decorate([
    common_1.Injectable(),
    __param(0, sequelize_1.InjectModel(event_model_1.Event)),
    __metadata("design:paramtypes", [Object])
], EventsService);
exports.EventsService = EventsService;
//# sourceMappingURL=events.service.js.map