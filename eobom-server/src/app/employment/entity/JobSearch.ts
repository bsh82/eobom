import {Entity, Column, BaseEntity, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne} from "typeorm";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM} from "../../common/CommonConstants";
import Caregiver from "@user/entity/Caregiver";
import {JobSearchState} from "../EmploymentConstants";
import Matching from "./Matching";

@Entity()
export default class JobSearch extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  jobSearchId: number;

  @ManyToOne(() => Caregiver, caregiver => caregiver.jobSearches)
  @JoinColumn({name: "caregiverId", referencedColumnName: "caregiverId"})
  caregiver: Caregiver;

  @OneToOne(() => Matching, matching => matching.jobSearch)
  matching: Matching;

  @Column({type: "json", nullable: false})
  coverRegion: string[];

  @Column({nullable: false})
  wantPay: number;

  @Column({type: COLUMN_TYPE_ENUM, enum: JobSearchState, nullable: false})
  jobSearchState: JobSearchState;

  @Column({type: "json", nullable: false})
  jobSearchSchedule: Record<string, {startTime: string; endTime: string}[]>;

  @Column({nullable: false})
  canOralCareAssistance: boolean;

  @Column({nullable: false})
  canFeedingAssistance: boolean;

  @Column({nullable: false})
  canGroomingAssistance: boolean;

  @Column({nullable: false})
  canDressingAssistance: boolean;

  @Column({nullable: false})
  canHairWashingAssistance: boolean;

  @Column({nullable: false})
  canBodyWashingAssistance: boolean;

  @Column({nullable: false})
  canToiletingAssistance: boolean;

  @Column({nullable: false})
  canMobilityAssistance: boolean;

  @Column({nullable: false})
  canPositionChangeAssistance: boolean;

  @Column({nullable: false})
  canPhysicalFunctionSupport: boolean;

  @Column({nullable: false})
  canCognitiveStimulation: boolean;

  @Column({nullable: false})
  canDailyLivingSupport: boolean;

  @Column({nullable: false})
  canCognitiveBehaviorManagement: boolean;

  @Column({nullable: false})
  canCommunicationSupport: boolean;

  @Column({nullable: false})
  canPersonalActivitySupport: boolean;

  @Column({nullable: false})
  canHousekeepingSupport: boolean;

  @CreateDateColumn()
  createDate: Date;
}
