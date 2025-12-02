package com.bazar.service.impl;

import com.bazar.domain.HomeCategorySection;
import com.bazar.model.Deal;
import com.bazar.model.Home;
import com.bazar.model.HomeCategory;
import com.bazar.repository.DealRepository;
import com.bazar.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HomeServiceImpl implements HomeService {
    private DealRepository dealRepository;
    @Override
    public Home createHomePageData(List<HomeCategory> allCategories) {
        List<HomeCategory> gridCategories = allCategories.stream().filter(category -> category.getSection() == HomeCategorySection.GRID).collect(Collectors.toList());
        List<HomeCategory> shopByCategories = allCategories.stream().filter(category -> category.getSection() == HomeCategorySection.SHOP_BY_CATEGORIES).collect(Collectors.toList());
        List<HomeCategory> electricCategories = allCategories.stream().filter(category -> category.getSection() == HomeCategorySection.ELECTRIC_CATEGORIES).collect(Collectors.toList());
        List<HomeCategory> dealCategories = allCategories.stream().filter(category -> category.getSection() == HomeCategorySection.DEALS).collect(Collectors.toList());
        List<Deal> createdDeals = new ArrayList<>();
        for (HomeCategory dealCategory : dealCategories) {
            Deal deal = dealRepository.findById(Long.valueOf(dealCategory.getCategoryId())).orElseThrow(() -> new RuntimeException("Deal not found with id: " + dealCategory.getCategoryId()));
            createdDeals.add(deal);
        }
        if (dealRepository.findAll().isEmpty()) {
            List<Deal> deals = allCategories.stream().filter(category -> category.getSection() == HomeCategorySection.DEALS).map(category -> new Deal(null, 10, category)).collect(Collectors.toList());
            createdDeals = dealRepository.saveAll(deals);
        } else createdDeals = dealRepository.findAll();

        Home home = new Home();
        home.setGridCategories(gridCategories);
        home.setShopByCategories(shopByCategories);
        home.setElectricCategories(electricCategories);
        home.setDealCategories(dealCategories);
        home.setDeals(createdDeals);
        return home;
        }
    }
