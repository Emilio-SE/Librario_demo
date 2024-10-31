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
import { CreateGoalDto } from './dto/create-goal.dto';

@Controller('reading/goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {

  constructor(private goalSvc: GoalsService) {}

  @Post()
  async createGoal(@Req() req: Request, @Body() body: CreateGoalDto) {
    const userId = req.user['id'];
    return this.goalSvc.createGoal(body, userId);
  }

  @Get()
  async getGoalsPreview(@Req() req: Request) {
    const userId = req.user['id'];
    return this.goalSvc.getPreviewGoals(userId);
  }

  @Get(':goal_id')
  async getGoalDetails(@Req() req: Request, @Param('goal_id') goalId: string) {
    const userId = req.user['id'];
    return this.goalSvc.getGoalDetails(userId, +goalId);
  }

  @Patch(':goal_id')
  async updateGoal(
    @Req() req: Request,
    @Param('goal_id') goalId: string,
    @Body() body: any,
  ) {
    const userId = req.user['id'];
    return this.goalSvc.updateGoal(userId, +goalId, body);
  }

  @Delete(':goal_id')
  async deleteGoal(@Req() req: Request, @Param('goal_id') goalId: string) {
    const userId = req.user['id'];
    return this.goalSvc.deleteGoal(userId, +goalId);
  }
}
