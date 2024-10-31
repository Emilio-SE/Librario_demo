import { NotFoundException } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';

export class ValidateUtils {
  public async findAndValidateEntity<T>(
    repository: Repository<T>,
    options: FindOneOptions<T>,
    entityName: string
  ): Promise<T> {
    const entity = await repository.findOne(options);

    if (!entity) {
      throw new NotFoundException(
        `${entityName} not found.`,
      );
    }

    return entity;
  }
}
