package com.bazar.controller;

import com.bazar.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController

public class HomeController {

    @GetMapping("/")

    public ApiResponse HomeControllerHandller() {
        ApiResponse response = new ApiResponse();
        response.setMessage("Welcome to Bazar MultiVendor E-Commerce Application");
        return response;
    }

}
