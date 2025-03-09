import {Entity, Column, BaseEntity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {COLUMN_TYPE_BIGINT, COLUMN_TYPE_ENUM} from "../../common/CommonConstants";
import Caregiver from "../../user/entity/Caregiver";
import {certiType} from "../DocumentsConstants";

@Entity()
export default class Certification extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  certiId: number;

  @ManyToOne(() => Caregiver)
  @JoinColumn({name: "caregiverId", referencedColumnName: "caregiverId"})
  caregiver: Caregiver;

  @Column({nullable: false})
  certiNumber: string;

  @Column({type: COLUMN_TYPE_ENUM, enum: certiType, nullable: false})
  certiType: certiType;
}
