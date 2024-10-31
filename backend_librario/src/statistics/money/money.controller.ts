import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { MoneyService } from './money.service';

@Controller('statistics/money')
@UseGuards(JwtAuthGuard)
export class MoneyController {
  constructor(private readonly moneyService: MoneyService) {}

  @Get('expenses')
  getMonthlyExpenses(@Req() req: Request): Promise<any> {
    const userId = req.user['id'];
    return this.moneyService.getMonthlyExpenses(userId);
  }
}
