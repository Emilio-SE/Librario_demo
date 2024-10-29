import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'format' })
export class Format {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}