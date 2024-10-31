import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { CreateGoalDto } from './dto/create-goal.dto';
import { GoalDto } from './dto/request-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

import { Goal } from './goals.entity';
import { Reading } from '../readings/reading.entity';

@Injectable()
export class GoalsService {
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
      throw new Error('Invalid date format');
    }

    if (finalDateObj < initialDateObj) {
      throw new Error('Final date must be greater than initial date');
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
    const goal = await this.entityManager.findOne(Goal, {
      where: { id: goalId, user: { id: userId } },
    });

    if (!goal) {
      throw new HttpException(
        `Goal with id ${goalId} not found for user ${userId}`,
        404,
      );
    }

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
    const goal = await this.entityManager.findOne(Goal, {
      where: { id: goalId, user: { id: userId } },
    });

    if (!goal) {
      throw new NotFoundException(
        `Goal with id ${goalId} not found for user ${userId}`,
      );
    }

    Object.assign(goal, updateGoalDto);

    return await this.entityManager.save(goal);
  }

  async deleteGoal(userId: number, goalId: number): Promise<Goal> {
    const goal = await this.entityManager.findOne(Goal, {
      where: { id: goalId, user: { id: userId } },
    });

    if (!goal) {
      throw new NotFoundException(
        `Goal with id ${goalId} not found for user ${userId}`,
      );
    }

    return await this.entityManager.remove(goal);
  }
}
