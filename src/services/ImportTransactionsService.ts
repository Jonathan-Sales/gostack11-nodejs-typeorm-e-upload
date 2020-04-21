import { getCustomRepository, getRepository, In } from 'typeorm';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parse';

import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface TransactionCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const file = path.join(uploadConfig.directory, filename);

    const parser = csv({
      from_line: 2,
      trim: true,
    });

    const transactions: TransactionCSV[] = [];
    const categories: string[] = [];
    const stream = fs.createReadStream(file).pipe(parser);
    stream.on('data', async ([title, type, value, category]) => {
      const newTransaction = {
        title,
        type,
        value,
        category,
      };

      categories.push(category);
      transactions.push(newTransaction);
    });
    await new Promise(resolve => stream.on('end', resolve));

    const categoriesAlreadyRegistered = await categoryRepository.find({
      where: { title: In(categories) },
    });

    const categoriesToInsert = categories
      .filter(
        title =>
          !categoriesAlreadyRegistered.find(
            category => category.title === title,
          ),
      )
      .filter((title, index, self) => self.indexOf(title) === index);

    const newCategories = categoriesToInsert.map(title =>
      categoryRepository.create({ title }),
    );

    await categoryRepository.save(newCategories);

    const allCategories = [...newCategories, ...categoriesAlreadyRegistered];

    const newTransactions = transactions.map(transaction => {
      const transactionCategory = allCategories.find(
        category => category.title === transaction.category,
      );

      const { title, type, value } = transaction;

      return transactionsRepository.create({
        title,
        type,
        value,
        category_id: transactionCategory?.id,
      });
    });

    await transactionsRepository.save(newTransactions);

    fs.promises.unlink(file);

    return newTransactions;
  }
}

export default ImportTransactionsService;
