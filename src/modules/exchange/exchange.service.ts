import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import {
  CreateExchangeDto,
  GetAllExchangeDto,
  UpdateExchangeDto,
} from './dtos';

@Injectable()
export class ExchangeService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(
    { page = 1, page_size = 10, search }: GetAllExchangeDto,
    user_id: string,
  ) {
    const skip = (page - 1) * page_size;

    const exchanges = await this.prisma.currencyExchange.findMany({
      where: {
        user_id,
        From_currency: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      },
      skip,
      take: page_size,
      orderBy: {
        created_at: 'desc',
      },
      include: {
        From_currency: true,
        To_currency: true,
      },
    });

    return {
      success: true,
      message: 'Barcha valyuta almashuvlari',
      data: exchanges,
      meta: {
        page,
        page_size,
        total: exchanges.length,
      },
    };
  }

  async getOne(id: string) {
    const founded = await this.prisma.currencyExchange.findFirst({
      where: {
        id,
      },
      include: {
        From_currency: true,
        To_currency: true,
      },
    });

    if (!founded) {
      throw new NotFoundException('Almashuv topilmadi!');
    }

    return {
      success: true,
      message: "Almashuv ID bo'yicha",
      data: founded,
    };
  }

  async delete(id: string) {
    const founded = await this.prisma.currencyExchange.findFirst({
      where: {
        id,
      },
    });

    if (!founded) {
      throw new NotFoundException('Almashuv topilmadi!');
    }
    await this.prisma.currencyExchange.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "Almashuv o'chirildi",
    };
  }

  async create(payload: CreateExchangeDto, user_id: string) {
    const founded = await this.prisma.currencyExchange.findFirst({
      where: {
        from_currency_id: payload.from_currency_id,
        to_currency_id: payload.to_currency_id,
      },
    });

    if (founded) {
      throw new ConflictException('Bunday almashuv allaqachon mavjud!');
    }

    const exchange = await this.prisma.currencyExchange.create({
      data: {
        from_currency_id: payload.from_currency_id,
        to_currency_id: payload.to_currency_id,
        rate: payload.rate,
        user_id,
      },
    });

    return {
      success: true,
      message: 'Almashuv yaratildi',
      data: exchange,
    };
  }

  async update(payload: UpdateExchangeDto, id: string) {
    const founded = await this.prisma.currencyExchange.findFirst({
      where: {
        id,
      },
    });

    if (!founded) {
      throw new NotFoundException('Almashuv topilmadi!');
    }

    const updated = await this.prisma.currencyExchange.update({
      where: { id },
      data: {
        rate: payload.rate,
      },
    });

    return {
      success: true,
      message: 'Almashuv qiymati yangilandi',
      data: updated,
    };
  }
}
