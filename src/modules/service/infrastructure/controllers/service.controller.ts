import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/shared/jwt-auth.guard';
import { CreateServiceDto } from '../dtos/service.dto';
import { CreateServiceUseCase } from '../../application/use-cases/createService';
import { UpdateServiceUseCase } from '../../application/use-cases/updateService';
import { GetUserServicesUseCase } from '../../application/use-cases/getUserServices';
import { GetListServicesUseCase } from '../../application/use-cases/listServices';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(
    private readonly createServiceUC: CreateServiceUseCase,
    private readonly updateServiceUC: UpdateServiceUseCase,
    private readonly getListServicesUC: GetListServicesUseCase,
    private readonly getUserServicesUC: GetUserServicesUseCase,
  ) {}

  @Post()
  async createService(@Req() req, @Body() dto: CreateServiceDto) {
    const userId = req.user.id;
    return this.createServiceUC.execute(userId, dto);
  }

  @Get('me')
  async getMyServices(@Req() req) {
    const userId = req.user.id;
    return this.getUserServicesUC.execute(userId);
  }

  @Get()
  async listServices(
    @Req() req,
    @Query('query') query?: string,
    @Query('tag') tag?: string,
    @Query('cat') cat?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('city') city?: string,
    @Query('near') near?: string,
    @Query('radius') radius?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = req.user?.id;
    return await this.getListServicesUC.execute({
      query,
      tag,
      cat,
      minPrice,
      maxPrice,
      city,
      near,
      radius,
      page,
      limit,
    }, userId);
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return {
      message: 'Get service detail endpoint (pending implementation)',
      id,
    };
  }

  @Patch(':id')
  async updateService(@Req() req, @Param('id') id: string, @Body() dto: any) {
    const userId = req.user.id;
    return this.updateServiceUC.execute(userId, id, dto);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string) {
    return {
      message: 'Delete service endpoint (pending implementation)',
      id,
    };
  }

  @Post(':id/categories')
  async assignCategories(@Param('id') id: string, @Body('categories') categories: string[]) {
    return {
      message: 'Assign categories endpoint (pending implementation)',
      id,
      categories,
    };
  }

  @Post(':id/tags')
  async assignTags(@Param('id') id: string, @Body('tags') tags: string[]) {
    return {
      message: 'Assign tags endpoint (pending implementation)',
      id,
      tags,
    };
  }

  @Patch(':id/cover')
  async setCover(@Param('id') id: string, @Body('mediaId') mediaId: string) {
    return {
      message: 'Set service cover endpoint (pending implementation)',
      id,
      mediaId,
    };
  }
}
