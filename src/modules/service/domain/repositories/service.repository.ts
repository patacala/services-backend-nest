import { ServiceEntity } from "../entities/service.entity";

export abstract class ServiceRepository {
  abstract create(data: Partial<ServiceEntity>): Promise<ServiceEntity>;

  abstract update(
    id: string,
    data: Partial<ServiceEntity>
  ): Promise<ServiceEntity>;
}
