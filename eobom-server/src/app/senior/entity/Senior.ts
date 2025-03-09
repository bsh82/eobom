import {Entity, Column, BaseEntity, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM} from "../../common/CommonConstants";
import Manager from "@user/entity/Manager";
import {Gender} from "../../common/CommonConstants";
import {SeniorGrade} from "../SeniorConstants";
import JobOffer from "../../employment/entity/JobOffer";

@Entity()
export default class Senior extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  seniorId: number;

  @ManyToOne(() => Manager)
  @JoinColumn({name: "managerId", referencedColumnName: "managerId"})
  manager: Manager;

  @OneToMany(() => JobOffer, jobOffer => jobOffer.senior, {cascade: true})
  jobOffers: JobOffer[];

  @Column({nullable: false})
  seniorName: string;

  @Column({nullable: false})
  seniorBirth: string;

  @Column({nullable: false})
  seniorAddress: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: Gender, nullable: false})
  seniorGender: Gender;

  @Column({type: COLUMN_TYPE_ENUM, enum: SeniorGrade, nullable: false})
  seniorGrade: SeniorGrade;

  @Column({type: "longblob", nullable: true})
  seniorProfileImage: Buffer | null;

  @Column({type: "varchar", nullable: true})
  seniorMimeType: string | null;

  @CreateDateColumn()
  createDate: Date;
}
