import { Injectable } from '@nestjs/common';
import { ServicetagRepository } from '../../domain/servicetag.repository';

@Injectable()
export class GetAllServicetagsUseCase {
  constructor(private readonly repository: ServicetagRepository) {}

  async execute() {
    return this.repository.findAll();
  }
}
