import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import {
  CreateCategoryDto,
  GetAllCategoryDto,
  UpdateCategoryDto,
} from './dtos';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(
    { page = 1, page_size = 10, search, category_type }: GetAllCategoryDto,
    user_id: string,
  ) {
    const skip = (page - 1) * page_size;

    const categories = await this.prisma.category.findMany({
      where: {
        name: {
          contains: search,
          mode: 'insensitive',
        },
        user_id,
        ...(category_type && { category_type }),
      },

      skip,
      take: page_size,
      orderBy: { created_at: 'desc' },
    });

    return {
      success: true,
      message: 'Barcha kategoriyalar',
      data: categories,
      meta: {
        total: categories.length,
        page,
        page_size,
      },
    };
  }

  async getOne(id: string) {
    const founded = await this.prisma.category.findFirst({
      where: {
        id,
      },
      include: {
        Transactions: true,
        User: true,
      },
    });

    if (!founded) {
      throw new NotFoundException('Kategoriya topilmadi!');
    }

    return {
      success: true,
      message: "Kategoriya ID bo'yicha",
      data: founded,
    };
  }

  async delete(id: string) {
    const founded = await this.prisma.category.findFirst({
      where: {
        id,
      },
    });
    if (!founded) {
      throw new NotFoundException('Kategoriya topilmadi!');
    }

    await this.prisma.category.delete({
      where: {
        id,
      },
    });
    return {
      success: true,
      message: "Kategoriya o'chirildi",
    };
  }

  async create(payload: CreateCategoryDto, user_id: string) {
    const founded = await this.prisma.category.findFirst({
      where: {
        name: payload.name,
        user_id,
      },
    });
    if (founded) {
      throw new ConflictException('Sizda bu kategoriya allaqachon mavjud!');
    }
    const category = await this.prisma.category.create({
      data: {
        name: payload.name,
        category_type: payload.category_type,
        user_id,
      },
    });
    return {
      success: true,
      message: 'Kategorya yaratildi',
      data: category,
    };
  }

  async update(
    payload: UpdateCategoryDto,
    user_id: string,
    category_id: string,
  ) {
    const founded = await this.prisma.category.findFirst({
      where: {
        id: category_id,
      },
    });
    if (!founded) {
      throw new NotFoundException('Kategoriya topilmadi');
    }

    if (payload.name !== undefined) {
      const isExists = await this.prisma.category.findFirst({
        where: {
          name: payload.name,
          user_id,
          id: {
            not: {
              equals: category_id,
            },
          },
        },
      });
      if (isExists) {
        throw new ConflictException(
          'Sizda bu nomli kategoriya allaqachon mavjud',
        );
      }
    }
    const updated = await this.prisma.category.update({
      where: {
        id: category_id,
      },
      data: {
        name: payload.name,
        category_type: payload.category_type,
      },
    });

    return {
      success: true,
      message: 'Kategoriya yangilndi',
      data: updated,
    };
  }
}
