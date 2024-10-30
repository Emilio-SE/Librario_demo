import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GoalsService } from './goals.service';

@Controller('reading/goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {

  constructor(private goalSvc: GoalsService) {}

  @Post()
  async createGoal(@Req() req: Request, @Body() body: any) {
    const userId = req.user['id'];
    return 'Create Goal';
  }

  @Get()
  async getGoalsPreview(@Req() req: Request) {
    const userId = req.user['id'];
    return 'Goals Preview';
  }

  @Get(':goal_id')
  async getGoalDetails(@Req() req: Request, @Param('goal_id') goalId: string) {
    const userId = req.user['id'];
    return 'Goal';
  }

  @Patch(':goal_id')
  async updateGoal(
    @Req() req: Request,
    @Param('goal_id') goalId: string,
    @Body() body: any,
  ) {
    const userId = req.user['id'];
    return 'Update Goal';
  }

  @Delete(':goal_id')
  async deleteGoal(@Req() req: Request, @Param('goal_id') goalId: string) {
    const userId = req.user['id'];
    return 'Delete Goal';
  }
}
