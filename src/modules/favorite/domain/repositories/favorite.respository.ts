import { FavoriteEntity } from "../../domain/entities/favorite.entity";

export abstract class FavoriteRepository {
  abstract create(userId: string, serviceId: string): Promise<FavoriteEntity>;
  abstract delete(userId: string, serviceId: string): Promise<void>;
  abstract findByUserAndService(userId: string, serviceId: string): Promise<FavoriteEntity | null>;
}