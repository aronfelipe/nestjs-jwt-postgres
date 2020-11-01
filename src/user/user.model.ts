import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
    CONSUMER = "consumer",
    ADMIN = "admin"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  role: string;
}