import { NotFoundException } from '@nestjs/common';
import { EntityManager, EntityTarget, FindOneOptions, Repository } from 'typeorm';

export class ValidateUtils {
  public async findByRepository<T>(
    repository: Repository<T> | EntityManager,
    options: FindOneOptions<T>,
    alias: string,
    entity?: EntityTarget<T>
  ): Promise<T> {

    let result = null;

    if(repository instanceof EntityManager){
      result = await repository.getRepository(entity).findOne(options);
    }else{
      result = await repository.findOne(options);
    }

    if (!result) {
      throw new NotFoundException(
        `${alias} not found.`,
      );
    }

    return result;
  }

}
