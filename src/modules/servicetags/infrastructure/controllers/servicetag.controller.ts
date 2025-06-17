import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { GetAllServicetagsUseCase } from '../../application/use-cases/get-all-servicetags.use-case';

@Controller('servicetags')
export class ServicetagController {
  constructor(private readonly getAllUC: GetAllServicetagsUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll() {
    return this.getAllUC.execute();
  }
}
