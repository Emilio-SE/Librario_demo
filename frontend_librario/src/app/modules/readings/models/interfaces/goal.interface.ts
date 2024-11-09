export interface GoalPreview {
  id: number;
  title: string;
  initialDate: string;
  finalDate: string;
  quantity: number;
  currentBooksRead: number;
  percentage: number;
}

export interface GoalDetails {
  id: number;
  title: string;
  initialDate: string;
  finalDate: string;
  quantity: number;
  currentBooksRead: number;
  percentage: number;
}

export interface CreateGoal {
  title: string;
  initialDate: string;
  finalDate: string;
  quantity: number;
}

export interface UpdateGoal {
  title?: string;
  initialDate?: string;
  finalDate?: string;
  quantity?: number;
}
