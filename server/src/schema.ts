import { z } from 'zod';

// Category schema
export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.enum(['expense', 'budget']), // Category can be used for both expenses and budgets
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Category = z.infer<typeof categorySchema>;

// Input schema for creating categories
export const createCategoryInputSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  type: z.enum(['expense', 'budget'])
});

export type CreateCategoryInput = z.infer<typeof createCategoryInputSchema>;

// Input schema for updating categories
export const updateCategoryInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Category name is required').optional(),
  type: z.enum(['expense', 'budget']).optional()
});

export type UpdateCategoryInput = z.infer<typeof updateCategoryInputSchema>;

// Budget schema
export const budgetSchema = z.object({
  id: z.number(),
  name: z.string(),
  amount: z.number().positive(),
  period: z.enum(['weekly', 'monthly']),
  category_id: z.number(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Budget = z.infer<typeof budgetSchema>;

// Input schema for creating budgets
export const createBudgetInputSchema = z.object({
  name: z.string().min(1, 'Budget name is required'),
  amount: z.number().positive('Amount must be positive'),
  period: z.enum(['weekly', 'monthly']),
  category_id: z.number()
});

export type CreateBudgetInput = z.infer<typeof createBudgetInputSchema>;

// Input schema for updating budgets
export const updateBudgetInputSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Budget name is required').optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  period: z.enum(['weekly', 'monthly']).optional(),
  category_id: z.number().optional()
});

export type UpdateBudgetInput = z.infer<typeof updateBudgetInputSchema>;

// Expense schema
export const expenseSchema = z.object({
  id: z.number(),
  amount: z.number().positive(),
  date: z.coerce.date(),
  category_id: z.number(),
  description: z.string().nullable(),
  payment_method: z.enum(['cash', 'card', 'bank_transfer', 'e_wallet']),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Expense = z.infer<typeof expenseSchema>;

// Input schema for creating expenses
export const createExpenseInputSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  date: z.coerce.date(),
  category_id: z.number(),
  description: z.string().nullable(),
  payment_method: z.enum(['cash', 'card', 'bank_transfer', 'e_wallet'])
});

export type CreateExpenseInput = z.infer<typeof createExpenseInputSchema>;

// Input schema for updating expenses
export const updateExpenseInputSchema = z.object({
  id: z.number(),
  amount: z.number().positive('Amount must be positive').optional(),
  date: z.coerce.date().optional(),
  category_id: z.number().optional(),
  description: z.string().nullable().optional(),
  payment_method: z.enum(['cash', 'card', 'bank_transfer', 'e_wallet']).optional()
});

export type UpdateExpenseInput = z.infer<typeof updateExpenseInputSchema>;

// Summary schemas
export const monthlySummarySchema = z.object({
  year: z.number(),
  month: z.number(),
  total_expenses: z.number(),
  total_budget: z.number(),
  remaining_budget: z.number(),
  categories: z.array(z.object({
    category_id: z.number(),
    category_name: z.string(),
    total_spent: z.number(),
    budget_amount: z.number().nullable()
  }))
});

export type MonthlySummary = z.infer<typeof monthlySummarySchema>;

export const yearlySummarySchema = z.object({
  year: z.number(),
  total_expenses: z.number(),
  total_budget: z.number(),
  monthly_breakdown: z.array(z.object({
    month: z.number(),
    total_expenses: z.number(),
    total_budget: z.number()
  }))
});

export type YearlySummary = z.infer<typeof yearlySummarySchema>;

// Input schemas for summary queries
export const monthlyQuerySchema = z.object({
  year: z.number(),
  month: z.number().min(1).max(12)
});

export type MonthlyQueryInput = z.infer<typeof monthlyQuerySchema>;

export const yearlyQuerySchema = z.object({
  year: z.number()
});

export type YearlyQueryInput = z.infer<typeof yearlyQuerySchema>;

// Delete input schema
export const deleteInputSchema = z.object({
  id: z.number()
});

export type DeleteInput = z.infer<typeof deleteInputSchema>;