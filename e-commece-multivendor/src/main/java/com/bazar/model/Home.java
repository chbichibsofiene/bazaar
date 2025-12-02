package com.bazar.model;


import lombok.*;

import java.util.List;

@Data
public class Home {
    private List<HomeCategory> gridCategories;
    private List<HomeCategory> shopByCategories;
    private List<HomeCategory> electricCategories;
    private List<HomeCategory> dealCategories;
    private List<Deal> deals;
}
