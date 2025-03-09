import {Entity, Column, BaseEntity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {COLUMN_TYPE_BIGINT} from "../../common/CommonConstants";
import Manager from "../../user/entity/Manager";

@Entity()
export default class BusinessRegistration extends BaseEntity {
  @PrimaryGeneratedColumn({type: COLUMN_TYPE_BIGINT})
  businessRegistId: number;

  @OneToOne(() => Manager)
  @JoinColumn({name: "managerId", referencedColumnName: "managerId"})
  manager: Manager;

  @Column({nullable: false})
  b_no: string;

  @Column({nullable: false})
  p_nm: string;

  @Column({nullable: false})
  start_dt: string;
}
