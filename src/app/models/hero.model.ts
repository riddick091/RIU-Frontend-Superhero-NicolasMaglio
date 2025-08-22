import { Auditable } from "./auditable.model";
import { Power } from "./power.model";

export class Hero extends Auditable {

  constructor(
    public id: number,
    public name: string,
    public powers: Power[],
    createdBy: string,
    public imageUrl?: string,
  ) {
    super(createdBy);
  }
}