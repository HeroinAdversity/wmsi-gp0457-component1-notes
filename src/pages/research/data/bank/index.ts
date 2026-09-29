import type { BankItem } from '../types';
import { J25_11_REWORDED } from './reworded/j25-11';
import { J25_12_REWORDED } from './reworded/j25-12';
import { J25_13_REWORDED } from './reworded/j25-13';
import { N25_11_REWORDED } from './reworded/n25-11';
import { N25_12_REWORDED } from './reworded/n25-12';
import { N25_13_REWORDED } from './reworded/n25-13';
import { M26_12_REWORDED } from './reworded/m26-12';
import { J26_11_REWORDED } from './reworded/j26-11';
import { J26_13_REWORDED } from './reworded/j26-13';
import { SP_25_REWORDED } from './reworded/sp-25';
import { J26_12_REWORDED } from './reworded/j26-12';
import { J26_12_MIRROR_A } from './mirrors/j26-12-a';

export const BANK: BankItem[] = [
  J25_11_REWORDED, J25_12_REWORDED, J25_13_REWORDED, N25_11_REWORDED, N25_12_REWORDED, N25_13_REWORDED,
  M26_12_REWORDED, J26_11_REWORDED, J26_12_REWORDED, J26_13_REWORDED, SP_25_REWORDED,
  J26_12_MIRROR_A,
];

export function getItem(id: string): BankItem | undefined {
  return BANK.find((b) => b.id === id);
}

export function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function sourceText(item: BankItem): string {
  return item.source.paragraphs.join('\n\n');
}
