package com.bazar.service.impl;

import com.bazar.model.Deal;
import com.bazar.model.HomeCategory;
import com.bazar.repository.DealRepository;
import com.bazar.repository.HomeCategoryRepository;
import com.bazar.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class DealServiceImpl implements DealService {
    private final DealRepository dealRepository;
    private final HomeCategoryRepository homeCategoryRepository;
    @Override
    public List<Deal> getAllDeals() {
        return dealRepository.findAll();
    }

    @Override
    public Deal createDeal(Deal deal) throws Exception {
        HomeCategory category=homeCategoryRepository.findById(deal.getCategory().getId()).orElseThrow(()->new Exception("Category not found"));
        Deal newDeal = dealRepository.save(deal);
        newDeal.setCategory(category);
        newDeal.setDiscount(deal.getDiscount());
        return dealRepository.save(newDeal);

    }

    @Override
    public Deal updateDeal(Deal deal, Long id) throws Exception {
        Deal existingDeal=dealRepository.findById(id).orElseThrow(()->new Exception("Deal not found"));
        HomeCategory category=homeCategoryRepository.findById(deal.getCategory().getId()).orElseThrow(()->new Exception("Category not found"));
        if (existingDeal!=null){
            if (deal.getDiscount()!=null){
                existingDeal.setDiscount(deal.getDiscount());
            }
            if (category!=null) {
                existingDeal.setCategory(category);
            }
            return dealRepository.save(existingDeal);
        }
        throw new Exception("Deal not found");
    }

    @Override
    public void deleteDeal(Long id) throws Exception {
        Deal deal=dealRepository.findById(id).orElseThrow(()->new Exception("Deal not found"));
        dealRepository.delete(deal);
    }
}
