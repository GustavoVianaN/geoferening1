import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { UpdateDateColumn } from "typeorm/decorator/columns/UpdateDateColumn";
import { Exclude } from 'class-transformer';
import { ApiProperty } from "@nestjs/swagger";
@Entity()

export class Types {
    @PrimaryGeneratedColumn()
    id: number;


    @ApiProperty(
        {
            example: 10
        }
    )
    @Column({ nullable: false })
    code: number;



    @ApiProperty(
        {
            example: 'Recinto'
        }
    )
    @Column({ length: 100, nullable: false })
    name: string;

    @ApiProperty(
        {
            example: 'ponto ou poligono'
        }
    )
    @Column({ length: 100, nullable: false })
    geometria: string;


    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    create_at: Date;

    @UpdateDateColumn({ name: 'update_at', nullable: false })
    @Exclude({ toPlainOnly: false })
    update_at: Date;
}




/*
DEFAULT 
[
  {
    "code": 1,
    "name": "Recinto",
    "geometria": "polígono"
  },
  {
    "code": 10,
    "name": "Camera",
    "geometria": "ponto"
  },
  {
    "code": 11,
    "name": "Portêiner",
    "geometria": "ponto"
  },
  {
    "code": 12,
    "name": "Silo",
    "geometria": "ponto"
  },
  {
    "code": 13,
    "name": "Tanque de armazenamento",
    "geometria": "ponto"
  },
  {
    "code": 2,
    "name": "Área de posicionamento de contêiners",
    "geometria": "polígono"
  },
  {
    "code": 3,
    "name": "Área de posicionamento de veículos",
    "geometria": "polígono"
  },
  {
    "code": 4,
    "name": "Área de conferência física",
    "geometria": "polígono"
  },
  {
    "code": 5,
    "name": "Área de armazenamento de lotes",
    "geometria": "polígono"
  },
  {
    "code": 6,
    "name": "Balança",
    "geometria": "ponto"
  },
  {
    "code": 7,
    "name": "Scanner",
    "geometria": "ponto"
  },
  {
    "code": 8,
    "name": "Portão, gate e similares",
    "geometria": "ponto"
  },
  {
    "code": 9,
    "name": "Catraca e similares",
    "geometria": "ponto"
  }
]

*/