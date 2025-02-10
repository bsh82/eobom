import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn, OneToOne} from "typeorm";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn({type: "bigint"})
  userid: number;

  @Column({nullable:false})
  name: string;
}