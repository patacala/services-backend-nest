export interface Servicetag {
  id: number;
  name: string;
  icon: string;
}

export abstract class ServicetagRepository {
  abstract findAll(): Promise<Servicetag[]>;
}
