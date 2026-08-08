import { prisma } from '../database/prisma/prismaClient';
import { IExercicioRepository } from '../../domain/repositories/IExercicioRepository';
import { CreateExercicioDTO, UpdateExercicioDTO } from '../../domain/dtos/ExercicioDTOs';
import { IExercicio } from '../../domain/entities/Exercicio';

export class PrismaExercicioRepository implements IExercicioRepository {

  async findById(idExercicio: number): Promise<IExercicio | null> {
    const exercicio = await prisma.exercicio.findUnique({ where: { idExercicio } });
    return exercicio;
  }

  async findAll(): Promise<IExercicio[]> {
    const exercicios = await prisma.exercicio.findMany({
      orderBy: {
        nomeExercicio: 'asc', // Retorna o catálogo ordenado alfabeticamente
      },
    });

    return exercicios;
  }

  async create(data: CreateExercicioDTO): Promise<IExercicio> {
    const novoExercicio = await prisma.exercicio.create({
      data: {
        nomeExercicio: data.nomeExercicio,
        grupoMuscular: data.grupoMuscular ?? null,
        permiteCarga: data.permiteCarga ?? true,
      },
    });
    return novoExercicio;
  }

  async update(data: UpdateExercicioDTO): Promise<IExercicio> {
    const { idExercicio, ...updateData } = data;
    const exercicioAtualizado = await prisma.exercicio.update({
      where: { idExercicio },
      data: updateData,
    });
    return exercicioAtualizado;
  }

  async delete(idExercicio: number): Promise<boolean> {
    const result = await prisma.exercicio.delete({
      where: { idExercicio },
    });
    return !!result; // Returns true if deleted, false if not found (Prisma throws error if not found)
  }
}