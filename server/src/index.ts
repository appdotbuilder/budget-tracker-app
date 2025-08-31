import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createCategoryInputSchema,
  updateCategoryInputSchema,
  deleteInputSchema,
  createBudgetInputSchema,
  updateBudgetInputSchema,
  createExpenseInputSchema,
  updateExpenseInputSchema,
  monthlyQuerySchema,
  yearlyQuerySchema
} from './schema';

// Import handlers
import { createCategory } from './handlers/create_category';
import { getCategories, getCategoriesByType } from './handlers/get_categories';
import { updateCategory } from './handlers/update_category';
import { deleteCategory } from './handlers/delete_category';

import { createBudget } from './handlers/create_budget';
import { getBudgets } from './handlers/get_budgets';
import { updateBudget } from './handlers/update_budget';
import { deleteBudget } from './handlers/delete_budget';

import { createExpense } from './handlers/create_expense';
import { getExpenses } from './handlers/get_expenses';
import { updateExpense } from './handlers/update_expense';
import { deleteExpense } from './handlers/delete_expense';

import { getMonthlySummary } from './handlers/get_monthly_summary';
import { getYearlySummary } from './handlers/get_yearly_summary';
import { z } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Category routes
  createCategory: publicProcedure
    .input(createCategoryInputSchema)
    .mutation(({ input }) => createCategory(input)),

  getCategories: publicProcedure
    .query(() => getCategories()),

  getCategoriesByType: publicProcedure
    .input(z.object({ type: z.enum(['expense', 'budget']) }))
    .query(({ input }) => getCategoriesByType(input.type)),

  updateCategory: publicProcedure
    .input(updateCategoryInputSchema)
    .mutation(({ input }) => updateCategory(input)),

  deleteCategory: publicProcedure
    .input(deleteInputSchema)
    .mutation(({ input }) => deleteCategory(input)),

  // Budget routes
  createBudget: publicProcedure
    .input(createBudgetInputSchema)
    .mutation(({ input }) => createBudget(input)),

  getBudgets: publicProcedure
    .query(() => getBudgets()),

  updateBudget: publicProcedure
    .input(updateBudgetInputSchema)
    .mutation(({ input }) => updateBudget(input)),

  deleteBudget: publicProcedure
    .input(deleteInputSchema)
    .mutation(({ input }) => deleteBudget(input)),

  // Expense routes
  createExpense: publicProcedure
    .input(createExpenseInputSchema)
    .mutation(({ input }) => createExpense(input)),

  getExpenses: publicProcedure
    .query(() => getExpenses()),

  updateExpense: publicProcedure
    .input(updateExpenseInputSchema)
    .mutation(({ input }) => updateExpense(input)),

  deleteExpense: publicProcedure
    .input(deleteInputSchema)
    .mutation(({ input }) => deleteExpense(input)),

  // Summary routes
  getMonthlySummary: publicProcedure
    .input(monthlyQuerySchema)
    .query(({ input }) => getMonthlySummary(input)),

  getYearlySummary: publicProcedure
    .input(yearlyQuerySchema)
    .query(({ input }) => getYearlySummary(input)),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();