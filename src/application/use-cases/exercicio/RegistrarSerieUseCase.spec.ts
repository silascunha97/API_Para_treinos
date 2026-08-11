/// <reference types="jest" />
import { RegistrarSerieUseCase } from './RegistrarSerieUseCase';
import { ISerieRepository as ISeriesRepository} from '../../../domain/repositories/ISerieRepository';

describe('RegistrarSerieUseCase (Unit Tests)', () => {
  let sut: RegistrarSerieUseCase; // System Under Test
  let seriesRepositoryMock: jest.Mocked<ISeriesRepository>;

  beforeEach(() => {
    // 1. Criar Mock do Repositório
    seriesRepositoryMock = {
      create: jest.fn(),
      findBySessaoId: jest.fn(),
    } as unknown as jest.Mocked<ISeriesRepository>;

    // 2. Instanciar o Use Case injetando o mock
    sut = new RegistrarSerieUseCase(seriesRepositoryMock);
  });

  it('deve lançar um erro se não houver repetições e nem tempo de isometria', async () => {
    // Act & Assert
    await expect(
      sut.execute({
        idSessao: 1,
        idExercicio: 10,
        numeroSerie: 1,
      })
    ).rejects.toThrow('A série deve conter repetições registradas ou tempo de isometria.');
  });

  it('deve identificar corretamente uma série com pausa isométrica', async () => {
    // Arrange
    const dto = {
      idSessao: 1,
      idExercicio: 5,
      numeroSerie: 1,
      repsRealizadas: 8,
      tempoPausaIsometricaSeg: 3,
      cargaAdicional: 12.5,
    };

    seriesRepositoryMock.create.mockResolvedValue({
      idSerie: 100,
      ...dto,
      concluido: true,
    });

    // Act
    const resultado = await sut.execute(dto);

    // Assert
    expect(resultado.tipoExecucaoSinalizada).toBe('DINAMICA_COM_PAUSA_ISOMETRICA');
    expect(seriesRepositoryMock.create).toHaveBeenCalledTimes(1);
    expect(seriesRepositoryMock.create).toHaveBeenCalledWith({
      idSessao: 1,
      idExercicio: 5,
      numeroSerie: 1,
      repsRealizadas: 8,
      tempoIsometriaSeg: null,
      tempoPausaIsometricaSeg: 3,
      cargaAdicional: 12.5,
      concluido: true,
    });
  });
});