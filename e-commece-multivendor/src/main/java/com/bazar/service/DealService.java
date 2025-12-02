package com.bazar.service;

import com.bazar.model.Deal;

import java.util.List;

public interface DealService {
    List<Deal> getAllDeals();

    Deal createDeal(Deal deal) throws Exception;

    Deal updateDeal(Deal deal, Long id) throws Exception;

    void deleteDeal(Long id) throws Exception;
}
