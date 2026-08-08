import { IUsuarioRepository, UsuarioEntity } from '../../domain/repositories/IUsuarioRepository';
import { CriarContaDTO } from '../../domain/dtos/AuthDTOs';
import { prisma } from '../database/prisma/prismaClient'; // Importe a sua instância Singleton do Prisma aqui.

// Importe a sua instância Singleton do Prisma aqui. 
// Exemplo: import { prisma } from '../database/prismaClient';
export class PrismaUsuarioRepository implements IUsuarioRepository {
  
  async findByEmail(email: string): Promise<UsuarioEntity | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });
    return usuario;
  }

  async findById(id: number): Promise<UsuarioEntity | null> {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
    });
    return usuario;
  }

  async create(data: CriarContaDTO & { senhaHash: string }): Promise<UsuarioEntity> {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: data.senhaHash, // O banco espera 'senha', passamos o hash seguro
        idPessoa: data.idPessoa ?? null, // Converte undefined para null, se idPessoa for opcional
      },
    });
    
    return novoUsuario;
  }
}