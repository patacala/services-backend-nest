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
import { CreateServiceUseCase } from '../../application/use-cases/createService';
import { CreateServiceDto } from '../dtos/service.dto';
import { GetUserServicesUseCase } from '../../application/use-cases/getUserServices';

@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServiceController {
  constructor(
    private readonly createServiceUC: CreateServiceUseCase,
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
    @Query('query') query?: string,
    @Query('tag') tag?: string,
    @Query('cat') cat?: string,
    @Query('city') city?: string,
    @Query('near') near?: string,
    @Query('radius') radius?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return {
      message: 'List services endpoint (pending implementation)',
      filters: { query, tag, cat, city, near, radius, page, limit },
    };
  }

  @Get(':id')
  async getServiceById(@Param('id') id: string) {
    return {
      message: 'Get service detail endpoint (pending implementation)',
      id,
    };
  }

  @Patch(':id')
  async updateService(@Param('id') id: string, @Body() dto: any) {
    return {
      message: 'Update service endpoint (pending implementation)',
      id,
      data: dto,
    };
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
