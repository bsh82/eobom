import {Entity, Column, BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, OneToOne} from "typeorm";
import {UserType} from "../UserConstants";
import {COLUMN_TYPE_ENUM} from "../../common/CommonConstants";
import Caregiver from "./Caregiver";
import Manager from "./Manager";
import {Gender} from "../../common/CommonConstants";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  userId: string;

  @OneToOne(() => Caregiver, caregiver => caregiver.user, {cascade: true, onDelete: "CASCADE"})
  caregiver: Caregiver;

  @OneToOne(() => Manager, manager => manager.user, {cascade: true, onDelete: "CASCADE"})
  manager: Manager;

  @Column({nullable: false, unique: true})
  id: string;

  @Column({nullable: false})
  pw: string;

  @Column({nullable: false})
  name: string;

  @Column({nullable: false})
  phone: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: UserType, nullable: false})
  userType: UserType;

  @Column({type: COLUMN_TYPE_ENUM, enum: Gender, nullable: false})
  gender: Gender;

  @Column({type: "longblob", nullable: true})
  profileImage: Buffer | null;

  @Column({type: "varchar", nullable: true})
  mimeType: string | null;

  @Column({type: "varchar", length: 512, nullable: true})
  refreshToken: string | null;

  @Column({type: "varchar", length: 2048, nullable: true})
  FCMToken: string | null;

  @CreateDateColumn()
  createDate: Date;
}
