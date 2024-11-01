import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalDto } from './dto/request-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

import { Goal } from './goals.entity';
import { Reading } from '../readings/reading.entity';

import { ValidateUtils } from 'src/common/utils/validate.utils';

@Injectable()
export class GoalsService {
  private readonly validateUtils: ValidateUtils = new ValidateUtils();

  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createGoal(
    createGoalDto: CreateGoalDto,
    userId: number,
  ): Promise<Goal> {
    const { title, initialDate, finalDate, quantity } = createGoalDto;

    const finalDateObj = new Date(finalDate);
    const initialDateObj = new Date(initialDate);

    if (isNaN(finalDateObj.getTime()) || isNaN(initialDateObj.getTime())) {
      throw new HttpException('Invalid date format', 400);
    }

    if (finalDateObj < initialDateObj) {
      throw new HttpException(
        'Final date must be greater than initial date',
        400,
      );
    }

    const newGoal = this.entityManager.create(Goal, {
      title,
      initialDate: initialDateObj,
      finalDate: finalDateObj,
      quantity,
      user: { id: userId },
    });

    return await this.entityManager.save(newGoal);
  }

  async getPreviewGoals(userId: number): Promise<GoalDto[]> {
    const goals = await this.entityManager.find(Goal, {
      where: { user: { id: userId } },
    });

    const results = await Promise.all(
      goals.map(async (goal) => {
        const readings = await this.getReadingDetails(userId, goal);

        const currentBooksRead = readings.length;
        const percentage = (currentBooksRead / goal.quantity) * 100;

        return {
          id: goal.id,
          title: goal.title,
          initialDate: goal.initialDate,
          finalDate: goal.finalDate,
          quantity: goal.quantity,
          currentBooksRead,
          percentage,
        };
      }),
    );

    return results;
  }

  async getGoalDetails(userId: number, goalId: number): Promise<GoalDto> {
    const goal = await this.getGoal(userId, goalId);

    const readings = await this.getReadingDetails(userId, goal);
    const currentBooksRead = readings.length;
    const percentage = (currentBooksRead / goal.quantity) * 100;

    return {
      id: goal.id,
      title: goal.title,
      initialDate: goal.initialDate,
      finalDate: goal.finalDate,
      quantity: goal.quantity,
      currentBooksRead,
      percentage,
    };
  }

  private async getReadingDetails(
    userId: number,
    goal: GoalDto,
  ): Promise<Reading[]> {
    return await this.entityManager
      .createQueryBuilder(Reading, 'reading')
      .where('reading.userId = :userId', { userId })
      .andWhere('reading.endReadingDate IS NOT NULL')
      .andWhere('reading.startReadingDate <= :finalDate', {
        finalDate: goal.finalDate,
      })
      .andWhere('reading.endReadingDate BETWEEN :initialDate AND :finalDate', {
        initialDate: goal.initialDate,
        finalDate: goal.finalDate,
      })
      .getMany();
  }

  async updateGoal(
    userId: number,
    goalId: number,
    updateGoalDto: UpdateGoalDto,
  ): Promise<Goal> {
    const goal = await this.getGoal(userId, goalId);

    Object.assign(goal, updateGoalDto);

    return await this.entityManager.save(goal);
  }

  async deleteGoal(userId: number, goalId: number): Promise<Goal> {
    const goal = await this.getGoal(userId, goalId);

    return await this.entityManager.remove(goal);
  }

  private async getGoal(userId: number, goalId: number): Promise<Goal> {
    return await this.validateUtils.findByRepository(
      this.entityManager,
      { where: { id: goalId, user: { id: userId } } },
      'Goal',
      Goal,
    );
  }
}
