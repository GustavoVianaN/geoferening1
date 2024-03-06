import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { UpdateDateColumn } from "typeorm/decorator/columns/UpdateDateColumn";
import { Exclude } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";
import { Types } from "./types.entity";

@Entity()

export class Events {
    @PrimaryGeneratedColumn()
    id: number;


    @ApiProperty(
        {
            example: 'iddevice'
        }
    )
    @Column({ nullable: false })
    iddevice: number;

    @ApiProperty(
        {
            example: 'identificação'
        }
    )
    @Column({ length: 100, nullable: false })
    access: string;

    @ApiProperty(
        {
            example: 'sector'
        }
    )
    @Column({ length: 100, nullable: false })
    sector: string;


    @ApiProperty(
        {
            example: 'functionLocal'
        }
    )
    @Column({ length: 100, nullable: false })
    functionLocal: string;


    @ApiProperty(
        {
            example: 'tipo'
        }
    )
    @Column({ name: 'typeId', nullable: false })
    typeId: number;
    @ManyToOne(() => Types, { eager: true, cascade: true })
    @JoinColumn({ name: 'typeId', referencedColumnName: 'id' })
    type: Types;



    @ApiProperty(
        {
            example: false
        }
    )
    @Column({ nullable: false })
    situation: boolean;


    @ApiProperty(
        {
            example: 'se o status for inativo tem que ter motivo '
        }
    )
    @Column({ length: 100, nullable: false })
    motivo: string;


    @ApiProperty(
        {
            example: 85
        }
    )
    @Column({ nullable: false })
    protocol: number;


    @ApiProperty(
        {
            example: ''
        }
    )
    @Column("int", { array: true })
    latitude: number[];


    @ApiProperty(
        {
            example: []
        }
    )
    @Column("int", { array: true })
    longitude: number[];

    @ApiProperty(
        {
            example: 345345
        }
    )
    @Column({ nullable: false })
    azimuth: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    create_at: Date;

    @UpdateDateColumn({ name: 'update_at', nullable: false })
    @Exclude({ toPlainOnly: false })
    update_at: Date;
}
