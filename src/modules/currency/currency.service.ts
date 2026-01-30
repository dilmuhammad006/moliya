import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { GetAllCurrencyDto } from './dtos/getAll';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dtos';

@Injectable()
export class CurrencyService {
  constructor(private readonly prisma: PrismaService) {}
  async getAll({ page = 1, page_size = 10, search }: GetAllCurrencyDto) {
    const skip = (page - 1) * page_size;

    const currencies = await this.prisma.currency.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      skip,
      take: page_size,
      orderBy: { created_at: 'desc' },
    });
    return {
      success: true,
      message: 'Barcha valyutalar',
      data: currencies,
      meta: {
        total: currencies.length,
        page,
        page_size,
      },
    };
  }

  async getOne(id: string) {
    const founded = await this.prisma.currency.findFirst({
      where: {
        id,
      },
      include: {
        Account: true,
        From_currency_exchanges: true,
        To_currency_exchanges: true,
        User: true,
      },
    });
    if (!founded) {
      throw new NotFoundException('Valyuta topilmadi!');
    }

    return {
      success: true,
      message: "Valyuta ID bo'yicha",
      data: founded,
    };
  }

  async delete(id: string) {
    const founded = await this.prisma.currency.findFirst({
      where: {
        id,
      },
    });
    if (!founded) {
      throw new NotFoundException('Valyuta topilmadi!');
    }
    await this.prisma.currency.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
      message: "Valyuta o'chirildi",
    };
  }

  async create(payload: CreateCurrencyDto, user_id: string) {
    const founded = await this.prisma.currency.findFirst({
      where: {
        name: payload.name,
        user_id,
      },
    });

    if (founded) {
      throw new ConflictException('Bu valyuta sizda allaqachon mavjud');
    }

    const currency = await this.prisma.currency.create({
      data: {
        name: payload.name,
        user_id,
      },
    });

    return {
      success: true,
      message: 'Valyuta yaratildi',
      data: currency,
    };
  }

  async update(
    payload: UpdateCurrencyDto,
    currency_id: string,
    user_id: string,
  ) {
    const founded = await this.prisma.currency.findFirst({
      where: { id: currency_id },
    });
    if (!founded) {
      throw new NotFoundException('Valyuta topilmadi!');
    }

    if (payload.name !== undefined) {
      const isExist = await this.prisma.currency.findFirst({
        where: {
          name: payload.name,
          id: { not: { equals: currency_id } },
          user_id: user_id,
        },
      });

      if (isExist) {
        throw new ConflictException('Bu valyuta sizda allaqachon mavjud!');
      }
    }

    const updated = await this.prisma.currency.update({
      where: {
        id: currency_id,
      },
      data: {
        name: payload.name,
      },
    });
    return {
      success: true,
      message: 'Valyuta yangilandi',
      data: updated,
    };
  }

  async getMy(user_id: string) {
    const currencies = await this.prisma.currency.findMany({
      where: {
        user_id,
      },
    });
    return {
      success: true,
      message: 'Sizning barcha valyutalaringiz',
      data: currencies,
      meta: {
        total: currencies.length,
      },
    };
  }
}
