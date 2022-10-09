import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	// select: false 该字段在查询时默认不被选中
	@Column({ select: false })
	password: string;

	@Column()
	email: string;
}
