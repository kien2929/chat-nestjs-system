import {
  DeepPartial,
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { BaseInterfaceRepository } from './base.interface.repository';

interface HasId {
  id: number;
}

export abstract class BaseAbstractRepository<T extends HasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public async create(data: DeepPartial<T>): Promise<T> {
    return this.entity.create(data);
  }

  public async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.create(data);
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    return this.entity.save(data);
  }

  public async remove(data: T): Promise<T> {
    return this.entity.remove(data);
  }

  public async findOneById(id: any): Promise<T> {
    const option: FindOptionsWhere<T> = {
      id,
    };
    return this.entity.findOneBy(option);
  }
  public async findByCondition(filterCondition: FindOneOptions<T>): Promise<T> {
    return this.entity.findOne(filterCondition);
  }
  public async findAll(filterCondition: FindManyOptions<T>): Promise<T[]> {
    return this.entity.find(filterCondition);
  }
  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return this.entity.find(relations);
  }
  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return this.entity.preload(entityLike);
  }
}
