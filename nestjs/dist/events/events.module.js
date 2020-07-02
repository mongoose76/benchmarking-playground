"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const sequelize_1 = require("@nestjs/sequelize");
const event_model_1 = require("./event.model");
const events_controller_1 = require("./events.controller");
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    common_1.Module({
        imports: [sequelize_1.SequelizeModule.forFeature([event_model_1.Event])],
        providers: [events_service_1.EventsService],
        controllers: [events_controller_1.EventsController],
    })
], EventsModule);
exports.EventsModule = EventsModule;
//# sourceMappingURL=events.module.js.map