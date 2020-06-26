import { Column, Model, Table } from 'sequelize-typescript';

@Table
export class Event extends Model<Event> {
  @Column
  type: string;

  @Column
  value: number;
}
