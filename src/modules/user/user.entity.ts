import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Exclude()
  id: number;

  @ApiProperty()
  @Column()
  @Generated('uuid')
  uuid: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  firstName: string;

  @ApiProperty()
  @Column('varchar', { length: 255 })
  lastName: string;

  @ApiProperty()
  @Column('varchar', { length: 255, unique: true })
  email: string;

  @Column('varchar', { length: 255 })
  @Exclude()
  password: string;

  @Column('bool', { default: false })
  @Exclude()
  isConfirmed?: boolean = false;

  @Column('bool', { default: false })
  @Exclude()
  isActive?: boolean = false;

  @Column('varchar', { length: 255, nullable: true })
  @Exclude()
  confirmationToken?: string;

  @Column('varchar', { length: 255, nullable: true })
  @Exclude()
  recoverToken?: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial?: Partial<User>) {
    Object.assign(this, partial);
  }
}
