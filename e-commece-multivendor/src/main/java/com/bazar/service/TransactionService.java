package com.bazar.service;

import com.bazar.model.Order;
import com.bazar.model.Seller;
import com.bazar.model.Transaction;

import java.util.List;

public interface TransactionService {
    Transaction createTransaction(Order order);
    List<Transaction> getTransactionsBySellerId(Seller seller);
    List<Transaction> getAllTransactions();
}
