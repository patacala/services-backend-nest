import { BookServiceEntity } from "../entities/bookService.entity";

export abstract class BookServiceRepository {
  abstract create(data: Partial<BookServiceEntity>): Promise<BookServiceEntity>;
}
