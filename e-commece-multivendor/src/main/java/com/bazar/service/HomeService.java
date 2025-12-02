package com.bazar.service;

import com.bazar.model.Home;
import com.bazar.model.HomeCategory;

import java.util.List;

public interface HomeService {
    public Home createHomePageData(List<HomeCategory> allCategories);
}
