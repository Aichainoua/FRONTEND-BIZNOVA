import type { Operation } from './types';

export function currentMonthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function operationsForMonth(operations: Operation[], month = currentMonthKey()): Operation[] {
  return operations.filter((operation) => operation.date.slice(0, 7) === month);
}
