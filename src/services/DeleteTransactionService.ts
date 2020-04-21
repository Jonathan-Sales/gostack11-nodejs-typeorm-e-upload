import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(transaction_id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(transaction_id);

    if (!transaction) {
      throw new AppError('This transaction not exists');
    }

    await transactionsRepository.delete(transaction_id);
  }
}

export default DeleteTransactionService;
