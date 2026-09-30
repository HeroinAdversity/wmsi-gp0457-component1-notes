import type { Q1BankItem, Q1Source, SourceNo } from '../types';
import { J25_11_Q1_REWORDED } from './reworded/j25-11';
import { J25_12_Q1_REWORDED } from './reworded/j25-12';
import { J25_13_Q1_REWORDED } from './reworded/j25-13';
import { N25_11_Q1_REWORDED } from './reworded/n25-11';
import { N25_12_Q1_REWORDED } from './reworded/n25-12';
import { N25_13_Q1_REWORDED } from './reworded/n25-13';
import { M26_12_Q1_REWORDED } from './reworded/m26-12';
import { J26_11_Q1_REWORDED } from './reworded/j26-11';
import { J26_12_Q1_REWORDED } from './reworded/j26-12';
import { J26_13_Q1_REWORDED } from './reworded/j26-13';
import { SP_25_Q1_REWORDED } from './reworded/sp-25';

export const Q1_BANK: Q1BankItem[] = [
  J25_11_Q1_REWORDED, J25_12_Q1_REWORDED, J25_13_Q1_REWORDED, N25_11_Q1_REWORDED, N25_12_Q1_REWORDED, N25_13_Q1_REWORDED, M26_12_Q1_REWORDED, J26_11_Q1_REWORDED, J26_12_Q1_REWORDED, J26_13_Q1_REWORDED, SP_25_Q1_REWORDED,
];

export function getQ1Item(id: string): Q1BankItem | undefined {
  return Q1_BANK.find((b) => b.id === id);
}

export function sourceBody(s: Q1Source): string {
  return [...s.paragraphs, ...(s.list ? [s.list.title, ...s.list.items] : [])].join('\n\n');
}

export function sourceOf(item: Q1BankItem, n: SourceNo): string {
  return sourceBody(n === 1 ? item.source1 : item.source2);
}

export function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}
