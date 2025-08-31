import { serial, text, pgTable, timestamp, numeric, integer, pgEnum } from 'drizzle-orm/pg-core';
import { relations as defineRelations } from 'drizzle-orm';

// Enums
export const categoryTypeEnum = pgEnum('category_type', ['expense', 'budget']);
export const budgetPeriodEnum = pgEnum('budget_period', ['weekly', 'monthly']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'card', 'bank_transfer', 'e_wallet']);

// Categories table
export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  type: categoryTypeEnum('type').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Budgets table
export const budgetsTable = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  period: budgetPeriodEnum('period').notNull(),
  category_id: integer('category_id').notNull().references(() => categoriesTable.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Expenses table
export const expensesTable = pgTable('expenses', {
  id: serial('id').primaryKey(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  category_id: integer('category_id').notNull().references(() => categoriesTable.id),
  description: text('description'), // Nullable by default
  payment_method: paymentMethodEnum('payment_method').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const categoriesRelations = defineRelations(categoriesTable, ({ many }) => ({
  budgets: many(budgetsTable),
  expenses: many(expensesTable)
}));

export const budgetsRelations = defineRelations(budgetsTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [budgetsTable.category_id],
    references: [categoriesTable.id]
  })
}));

export const expensesRelations = defineRelations(expensesTable, ({ one }) => ({
  category: one(categoriesTable, {
    fields: [expensesTable.category_id],
    references: [categoriesTable.id]
  })
}));

// TypeScript types for the table schemas
export type Category = typeof categoriesTable.$inferSelect;
export type NewCategory = typeof categoriesTable.$inferInsert;

export type Budget = typeof budgetsTable.$inferSelect;
export type NewBudget = typeof budgetsTable.$inferInsert;

export type Expense = typeof expensesTable.$inferSelect;
export type NewExpense = typeof expensesTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  categories: categoriesTable,
  budgets: budgetsTable,
  expenses: expensesTable
};

export const schemaRelations = {
  categoriesRelations,
  budgetsRelations,
  expensesRelations
};