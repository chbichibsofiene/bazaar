package com.bazar.controller;

import com.bazar.model.Home;
import com.bazar.model.HomeCategory;
import com.bazar.service.HomeCategoryService;
import com.bazar.service.HomeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class HomeCategoryController {
    private final HomeCategoryService homeCategoryService;
    private final HomeService homeService;

    @PostMapping("/home/categories" )
    public ResponseEntity<Home> createHomeCategories(@RequestBody List<HomeCategory> homeCategories){
        List<HomeCategory> categories=homeCategoryService.createHomeCategories(homeCategories);
        Home home=homeService.createHomePageData(categories);
        return new ResponseEntity<>(home, HttpStatus.ACCEPTED);
    }
    @GetMapping("/admin/home-categories" )
    public ResponseEntity<List<HomeCategory>> getHomeCategory(){
        List<HomeCategory> categories=homeCategoryService.getAllHomeCategories();
        return ResponseEntity.ok(categories);
    }
    @PatchMapping("/admin/home-category/{id}" )
    public ResponseEntity<HomeCategory> updateHomeCategory(@RequestBody HomeCategory homeCategory, @PathVariable Long id) {
        HomeCategory updatedCategory = homeCategoryService.updateHomeCategory(homeCategory, id);
        return ResponseEntity.ok(updatedCategory);
    }
}
