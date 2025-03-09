import {Entity, Column, BaseEntity, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany} from "typeorm";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM} from "../../common/CommonConstants";
import Manager from "@user/entity/Manager";
import Senior from "src/app/senior/entity/Senior";
import Matching from "./Matching";
import {JobOfferState} from "../EmploymentConstants";

@Entity()
export default class JobOffer extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  jobOfferId: number;

  @ManyToOne(() => Manager, manager => manager.jobOffers)
  @JoinColumn({name: "managerId", referencedColumnName: "managerId"})
  manager: Manager;

  @ManyToOne(() => Senior)
  @JoinColumn({name: "seniorId", referencedColumnName: "seniorId"})
  senior: Senior;

  @OneToMany(() => Matching, matching => matching.jobOffer)
  matchings: Matching[];

  @Column({nullable: false})
  offerPay: number;

  @Column({nullable: false})
  wantRecruits: number;

  @Column({default: 0, nullable: false})
  currentRecruits: number;

  @Column({type: COLUMN_TYPE_ENUM, enum: JobOfferState, nullable: false})
  jobOfferState: JobOfferState;

  @Column({type: "json", nullable: false})
  jobOfferSchedule: Record<string, {startTime: string; endTime: string}[]>;

  @Column({nullable: true})
  reqMent: string;

  @Column({type: "json", nullable: true})
  wantList: string[];

  @Column({nullable: false})
  isBathingAssistanceNeeded: boolean;

  @Column({nullable: false})
  isOralCareAssistanceNeeded: boolean;

  @Column({nullable: false})
  isFeedingAssistanceNeeded: boolean;

  @Column({nullable: false})
  isGroomingAssistanceNeeded: boolean;

  @Column({nullable: false})
  isDressingAssistanceNeeded: boolean;

  @Column({nullable: false})
  isHairWashingAssistanceNeeded: boolean;

  @Column({nullable: false})
  isBodyWashingAssistanceNeeded: boolean;

  @Column({nullable: false})
  isToiletingAssistanceNeeded: boolean;

  @Column({nullable: false})
  isMobilityAssistanceNeeded: boolean;

  @Column({nullable: false})
  isPositionChangeAssistanceNeeded: boolean;

  @Column({nullable: false})
  isPhysicalFunctionSupportNeeded: boolean;

  @Column({nullable: false})
  isCognitiveStimulationNeeded: boolean;

  @Column({nullable: false})
  isDailyLivingSupportNeeded: boolean;

  @Column({nullable: false})
  isCognitiveBehaviorManagementNeeded: boolean;

  @Column({nullable: false})
  isCommunicationSupportNeeded: boolean;

  @Column({nullable: false})
  isPersonalActivitySupportNeeded: boolean;

  @Column({nullable: false})
  isHousekeepingSupportNeeded: boolean;

  @CreateDateColumn()
  createDate: Date;
}
