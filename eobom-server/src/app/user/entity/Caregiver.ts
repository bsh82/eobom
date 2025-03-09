import {Entity, Column, BaseEntity, JoinColumn, OneToOne, PrimaryColumn, OneToMany} from "typeorm";
import User from "./User";
import Certification from "../../documents/entity/Certification";
import JobSearch from "src/app/employment/entity/JobSearch";

@Entity()
export default class Caregiver extends BaseEntity {
  @PrimaryColumn("uuid")
  caregiverId: string;

  @OneToOne(() => User, user => user.caregiver)
  @JoinColumn({name: "caregiverId", referencedColumnName: "userId"})
  user: User;

  @OneToMany(() => Certification, certification => certification.caregiver, {cascade: true, onDelete: "CASCADE"})
  certifications: Certification[];

  @OneToMany(() => JobSearch, jobSearch => jobSearch.caregiver, {cascade: true, onDelete: "CASCADE"})
  jobSearches: JobSearch[];

  @Column({nullable: false})
  caregiverAddress: string;

  @Column({nullable: false})
  hasCar: boolean;

  @Column({nullable: false})
  hasDrivingLicense: boolean;

  @Column({nullable: false})
  isDmentialTrained: boolean;

  @Column({type: "json", nullable: true})
  career: {campany: string; period: string; contents: string}[] | null;

  @Column({type: "varchar", nullable: true})
  intro: string | null;
}
