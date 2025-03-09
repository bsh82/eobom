import {Entity, Column, BaseEntity, JoinColumn, CreateDateColumn, PrimaryGeneratedColumn, ManyToOne, OneToOne} from "typeorm";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM} from "../../common/CommonConstants";
import JobSearch from "./JobSearch";
import JobOffer from "./JobOffer";
import {MatchingState, MatchingType} from "../EmploymentConstants";

@Entity()
export default class Matching extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  matchingId: number;

  @OneToOne(() => JobSearch, jobsearch => jobsearch.matching)
  @JoinColumn({name: "jobSearchId", referencedColumnName: "jobSearchId"})
  jobSearch: JobSearch;

  @ManyToOne(() => JobOffer, joboffer => joboffer.matchings)
  @JoinColumn({name: "jobOfferId", referencedColumnName: "jobOfferId"})
  jobOffer: JobOffer;

  @Column({type: COLUMN_TYPE_ENUM, enum: MatchingState, nullable: false})
  matchingState: MatchingState;

  @Column({type: COLUMN_TYPE_ENUM, enum: MatchingType, default: MatchingType.GENERAL ,nullable: false})
  matchingType: MatchingType;

  @CreateDateColumn()
  createDate: Date;
}
