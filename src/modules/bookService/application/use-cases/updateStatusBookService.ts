import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma.service';
import { BookServiceStatus, UpdateBookServiceStatusDto } from '../../infrastructure/dtos/bookService.dto';

@Injectable()
export class UpdateBookServiceStatusUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, bookingId: string, dto: UpdateBookServiceStatusDto) {
    try {
      if (!dto.status) {
        throw new BadRequestException('Status is required');
      }

      // Obtener la reserva actual
      const currentBooking = await this.prisma.bookService.findUnique({
        where: { id: bookingId },
        include: {
          service: true,
          user: true,
        },
      });

      if (!currentBooking) {
        throw new BadRequestException('Booking not found');
      }

      // Verificar que el usuario tenga permisos para actualizar esta reserva
      const isServiceOwner = currentBooking.service.user_id === userId;
      const isBookingOwner = currentBooking.user_id === userId;
      
      if (!isServiceOwner && !isBookingOwner) {
        throw new BadRequestException('You do not have permission to update this booking');
      }

      // Validar transiciones de estado
      const currentStatus = currentBooking.status as BookServiceStatus;
      const newStatus = dto.status;

      if (!this.isValidStatusTransition(currentStatus, newStatus, isServiceOwner, isBookingOwner)) {
        throw new BadRequestException(`Cannot change status from ${currentStatus} to ${newStatus}`);
      }

      // Actualizar el estado
      const updatedBooking = await this.prisma.bookService.update({
        where: { id: bookingId },
        data: { status: newStatus },
        include: {
          service: true,
          user: true,
        },
      });

      return {
        id: updatedBooking.id,
        serviceId: updatedBooking.service_id,
        serviceName: updatedBooking.service_name,
        userId: updatedBooking.user_id,
        dateTime: updatedBooking.date_time,
        address: updatedBooking.address,
        comments: updatedBooking.comments,
        responsibleName: updatedBooking.responsible_name,
        phoneNumber: updatedBooking.phone_number,
        status: updatedBooking.status,
        createdAt: updatedBooking.created_at,
        updatedAt: updatedBooking.updated_at,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update book service status');
    }
  }

  private isValidStatusTransition(
    currentStatus: BookServiceStatus,
    newStatus: BookServiceStatus,
    isServiceOwner: boolean,
    isBookingOwner: boolean
  ): boolean {
    // Si el estado es el mismo, no hay cambio
    if (currentStatus === newStatus) {
      return false;
    }

    // Estados terminales no pueden ser cambiados
    if (currentStatus === BookServiceStatus.completed || 
        currentStatus === BookServiceStatus.rejected || 
        currentStatus === BookServiceStatus.cancelled) {
      return false;
    }

    // Validaciones específicas según el estado actual y quien hace el cambio
    switch (currentStatus) {
      case BookServiceStatus.pending:
        // Desde pending, el proveedor puede aceptar o rechazar
        if (isServiceOwner) {
          return newStatus === BookServiceStatus.accepted || newStatus === BookServiceStatus.rejected;
        }
        // El cliente puede cancelar
        if (isBookingOwner) {
          return newStatus === BookServiceStatus.cancelled;
        }
        return false;

      case BookServiceStatus.accepted:
        // Desde accepted, el proveedor puede completar
        if (isServiceOwner) {
          return newStatus === BookServiceStatus.completed;
        }
        // El cliente puede cancelar
        if (isBookingOwner) {
          return newStatus === BookServiceStatus.cancelled;
        }
        return false;

      default:
        return false;
    }
  }
}