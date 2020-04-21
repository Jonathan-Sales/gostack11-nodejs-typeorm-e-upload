import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getTransactionsWithCategory(): Promise<Transaction[]> {
    const transactions = await this.createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.category', 'category')
      .select([
        'transaction.id',
        'transaction.title',
        'transaction.value',
        'transaction.type',
        'category.id',
        'category.title',
      ])
      .getMany();

    return transactions;
  }

  public async getBalance(): Promise<Balance> {
    let { income } = await this.createQueryBuilder('transactions')
      .where({
        type: 'income',
      })
      .select('sum(value)', 'income')
      .getRawOne();
    income = income || 0;

    let { outcome } = await this.createQueryBuilder('transactions')
      .where({
        type: 'outcome',
      })
      .select('sum(value)', 'outcome')
      .getRawOne();
    outcome = outcome || 0;

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
