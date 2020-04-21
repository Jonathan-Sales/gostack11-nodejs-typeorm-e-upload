import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: categoryTitle,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const checkBalance = await transactionRepository.getBalance();

    if (
      type === 'outcome' &&
      checkBalance.income < checkBalance.outcome + value
    ) {
      throw new AppError('Insufficient funds to do this transaction');
    }

    let category = await categoryRepository.findOne({
      title: categoryTitle,
    });

    if (!category) {
      category = categoryRepository.create({
        title: categoryTitle,
      });
      category = await categoryRepository.save(category);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
