import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetAllServicetagsUseCase } from '../../application/use-cases/get-all-servicetags.use-case';
import { FirebaseAuthGuard } from '@/shared/firebase/firebase-auth.guard';

@Controller('servicetags')
export class ServicetagController {
  constructor(private readonly getAllUC: GetAllServicetagsUseCase) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  async getAll() {
    return this.getAllUC.execute();
  }
}
