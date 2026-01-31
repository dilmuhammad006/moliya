import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { CreateTransactionDto, GetAllTransactionDto } from './dtos';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(
    {
      page = 1,
      page_size = 10,
      from_account_id,
      category_id,
      transaction_type,
    }: GetAllTransactionDto,
    user_id: string,
  ) {
    const skip = (page - 1) * page_size;

    const transactions = await this.prisma.transaction.findMany({
      where: {
        ...(from_account_id && { from_account_id }),
        ...(category_id && { category_id }),
        ...(transaction_type && { transaction_type }),
        user_id,
      },
      include: {
        Category: true,
        From_account: true,
        To_account: true,
      },
      skip,
      take: page_size,
      orderBy: { created_at: 'desc' },
    });

    return {
      success: true,
      message: "Barcha o'tkazmalar",
      data: transactions,
      meta: {
        total: transactions.length,
        page,
        page_size,
      },
    };
  }

  async getOne(id: string) {
    const founded = await this.prisma.transaction.findFirst({
      where: {
        id,
      },
    });
    if (!founded) {
      throw new NotFoundException("O'tkazma topilmadi!");
    }

    return {
      success: true,
      message: "O'tkazma ID bo'yicha",
      data: founded,
    };
  }

  async delete(id: string) {
    const founded = await this.prisma.transaction.findFirst({
      where: {
        id,
      },
    });
    if (!founded) {
      throw new NotFoundException("O'tkazma topilmadi!");
    }

    await this.prisma.transaction.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      message: "O'tkzama o'chirildi",
    };
  }

  async create(payload: CreateTransactionDto, user_id: string) {
    // Transfer
    if (
      payload.transaction_type === TransactionType.TRANSFER &&
      payload.from_account_id &&
      payload.to_account_id
    ) {
      const foundedFromAccount = await this.prisma.account.findFirst({
        where: {
          id: payload.from_account_id,
        },
      });
      if (!foundedFromAccount) {
        throw new BadRequestException(
          "O'tkazmani jo'natuvchi akkaunt topilmadi!",
        );
      }
      if (foundedFromAccount.balance < payload.amount) {
        throw new BadRequestException('Balans yetarli emas!');
      }
      const fromAccountBalance = foundedFromAccount.balance - payload.amount;

      const foundedToAccount = await this.prisma.account.findFirst({
        where: {
          id: payload.to_account_id,
        },
      });

      if (!foundedToAccount) {
        throw new BadRequestException(
          "O'tkazmani qabul qiluvchi akkaunt topilmadi!",
        );
      }
      const toAccountBalance = foundedToAccount.balance + payload.amount;

      try {
        await this.prisma.account.update({
          where: {
            id: payload.from_account_id,
          },
          data: {
            balance: fromAccountBalance,
          },
        });
        await this.prisma.account.update({
          where: {
            id: payload.to_account_id,
          },
          data: {
            balance: toAccountBalance,
          },
        });
        const transaction = await this.prisma.transaction.create({
          data: {
            from_account_id: payload.from_account_id,
            to_account_id: payload.to_account_id,
            user_id,
            transaction_type: TransactionType.TRANSFER,
            amount: payload.amount,
            comment: payload.comment,
          },
        });
        return {
          success: false,
          message: "O'tkazma amalga oshirishda xatolik yuzaga keldi!",
          data: transaction,
        };
      } catch (error) {
        return {
          success: false,
          message: "O'tkazma amalga oshirishda xatolik yuzaga keldi!",
          serever_message: error.message,
        };
      }
    }

    // Income
    if (
      payload.transaction_type === TransactionType.INCOME &&
      payload.to_account_id
    ) {
      const foundedToAccount = await this.prisma.account.findFirst({
        where: {
          id: payload.to_account_id,
        },
      });

      if (!foundedToAccount) {
        throw new BadRequestException("O'tkazmani qiluvchi akkaunt topilmadi!");
      }
      const balance = foundedToAccount.balance + payload.amount;

      try {
        await this.prisma.account.update({
          where: {
            id: payload.to_account_id,
          },
          data: {
            balance,
          },
        });
        const transaction = await this.prisma.transaction.create({
          data: {
            amount: payload.amount,
            to_account_id: payload.to_account_id,
            category_id: payload.category_id,
            transaction_type: TransactionType.INCOME,
            comment: payload.comment,
            user_id,
          },
        });

        return {
          success: true,
          message: "O'tkazma amalga oshirildi",
          data: transaction,
        };
      } catch (error) {
        return {
          success: false,
          message: "O'tkazma amalga oshirishda xatolik yuzaga keldi!",
          serverMessage: error.message,
        };
      }
    }

    // Outcome

    if (
      payload.transaction_type === TransactionType.OUTCOME &&
      payload.from_account_id
    ) {
      const foundedFromAccount = await this.prisma.account.findFirst({
        where: {
          id: payload.from_account_id,
        },
      });
      if (!foundedFromAccount) {
        throw new BadRequestException(
          "O'tkazmani jo'natuvchi akkaunt topilmadi!",
        );
      }
      if (foundedFromAccount.balance < payload.amount) {
        throw new BadRequestException('Balans yetarli emas!');
      }
      const balance = foundedFromAccount.balance - payload.amount;

      try {
        await this.prisma.account.update({
          where: {
            id: payload.from_account_id,
          },
          data: {
            balance,
          },
        });
        const transaction = await this.prisma.transaction.create({
          data: {
            amount: payload.amount,
            from_account_id: payload.from_account_id,
            category_id: payload.category_id,
            transaction_type: TransactionType.OUTCOME,
            user_id,
            comment: payload.comment,
          },
        });
        return {
          success: false,
          message: "O'tkamani amalga oshirildi",
          data: transaction,
        };
      } catch (error) {
        return {
          success: false,
          message: "O'tkamani amalga oshirishda xatolik yuzaga keldi!",
          serverMessage: error.message,
        };
      }
    }
  }
}
