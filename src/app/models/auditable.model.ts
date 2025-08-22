export class Auditable {
    public createdAt: Date;
    public createdBy: string;

    constructor(createdBy: string) {
        this.createdAt = new Date();
        this.createdBy = createdBy;
    }
}