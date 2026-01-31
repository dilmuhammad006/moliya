import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateAaccountDto, GetAllAccountDto, UpdateAccountDto } from './dtos';
import { AccountStatus } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(
    { page = 1, page_size = 10, search, account_type }: GetAllAccountDto,
    user_id: string,
  ) {
    const skip = (page - 1) * page_size;

    const accounts = await this.prisma.account.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        user_id,
        account_type: {
          not: {
            equals: AccountStatus.DELETED,
          },
          equals: account_type,
        },
      },
      include: { Currency: true },
      skip,
      take: page_size,
      orderBy: { created_at: 'desc' },
    });

    return {
      success: true,
      message: 'Barcha akkauntlar',
      data: accounts,
      meta: {
        page,
        page_size,
        total: accounts.length,
      },
    };
  }

  async getOne(id: string) {
    const founded = await this.prisma.account.findFirst({
      where: {
        id,
      },
      include: {
        Currency: true,
        Incoming_transactions: true,
        Outgoing_transactions: true,
        User: true,
      },
    });
    if (!founded) {
      throw new NotFoundException('Akkaunt topilmadi!');
    }

    return {
      success: true,
      message: "Akkaunt ID bo'yicha",
      data: founded,
    };
  }
  async delete(id: string) {
    const founded = await this.prisma.account.findFirst({
      where: {
        id,
        account_type: {
          not: AccountStatus.DELETED,
        },
      },
    });
    if (!founded) {
      throw new NotFoundException('Akkaunt topilmadi!');
    }

    await this.prisma.account.update({
      where: {
        id,
      },
      data: {
        account_type: AccountStatus.DELETED,
      },
    });
    return {
      success: true,
      message: "Akkaunt o'chirildi",
    };
  }

  async create(payload: CreateAaccountDto, user_id: string) {
    const founded = await this.prisma.account.findFirst({
      where: {
        name: payload.name,
        user_id,
      },
    });

    if (founded) {
      throw new ConflictException('Sizda bu nomli akkaunt allaqachon mavjud!');
    }

    const account = await this.prisma.account.create({
      data: {
        name: payload.name,
        balance: payload.balance ? payload.balance : 0,
        user_id,
        currency_id: payload.currency_id,
        account_type: AccountStatus.ACTIVE,
      },
    });

    return {
      success: true,
      message: 'Akkaunt yaratildi',
      data: account,
    };
  }

  async update(payload: UpdateAccountDto, user_id: string, account_id: string) {
    const founded = await this.prisma.account.findFirst({
      where: {
        id: account_id,
      },
    });

    if (!founded) {
      throw new NotFoundException('Akkaunt topilmadi!');
    }

    if (payload.name !== undefined) {
      const isExists = await this.prisma.account.findFirst({
        where: {
          name: payload.name,
          user_id,
          id: { not: account_id },
        },
      });

      if (isExists) {
        throw new ConflictException(
          'Sizda bu nomli akkaunt allaqachon mavjud!',
        );
      }
    }
    const updated = await this.prisma.account.update({
      where: {
        id: account_id,
      },
      data: {
        name: payload.name,
        currency_id: payload.currency_id,
        account_type: payload.account_type,
      },
    });

    return {
      success: true,
      message: 'Akkaunt yangilandi',
      data: updated,
    };
  }
}
