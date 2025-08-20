export class Category {
  constructor(
    public readonly id: string,
    public readonly name_es: string,
    public readonly name_en: string,
    public readonly slug_es: string,
    public readonly slug_en: string,
    public readonly parent_id?: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}