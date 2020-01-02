import { Entity, Column, PrimaryGeneratedColumn, Generated, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Company {

	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Generated("uuid")
	uuid: string;

	@Column('varchar', { length: 255 })
    name: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}