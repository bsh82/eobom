import {Entity, Column, BaseEntity, JoinColumn, OneToOne, PrimaryColumn, OneToMany} from "typeorm";
import User from "./User";
import BusinessRegistration from "src/app/documents/entity/BusinessRegistration";
import {COLUMN_TYPE_ENUM} from "../../common/CommonConstants";
import {CenterGrade} from "@user/UserConstants";
import Senior from "src/app/senior/entity/Senior";
import JobOffer from "../../employment/entity/JobOffer";

@Entity()
export default class Manager extends BaseEntity {
  @PrimaryColumn("uuid")
  managerId: string;

  @OneToOne(() => User, user => user.manager)
  @JoinColumn({name: "managerId", referencedColumnName: "userId"})
  user: User;

  @OneToOne(() => BusinessRegistration, businessRegistration => businessRegistration.manager, {cascade: true, onDelete: "CASCADE"})
  businessRegistration: BusinessRegistration;

  @OneToMany(() => Senior, senior => senior.manager, {cascade: true, onDelete: "CASCADE"})
  seniors: Senior[];

  @OneToMany(() => JobOffer, jobOffer => jobOffer.manager)
  jobOffers: JobOffer[];

  @Column({nullable: false})
  centerName: string;

  @Column({nullable: false})
  centerAddress: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: CenterGrade, nullable: true})
  centerGrade: CenterGrade | null;

  @Column({nullable: false})
  hasBathVehicle: boolean;

  @Column({type: "varchar", nullable: true})
  operatingPeriod: string;

  @Column({type: "varchar", nullable: true})
  centeIntro: string | null;
}
