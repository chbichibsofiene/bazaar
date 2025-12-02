package com.bazar.controller;

import com.bazar.model.Deal;
import com.bazar.response.ApiResponse;
import com.bazar.service.DealService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/deals")
public class DealController {
    private final DealService dealService;

    @PostMapping
    public ResponseEntity<Deal> createDeals(@RequestBody Deal deals) throws Exception {
        Deal createdDeals=dealService.createDeal(deals);
        return new ResponseEntity<>(createdDeals, HttpStatus.ACCEPTED);
    }
    @PatchMapping("/{id}")
    public ResponseEntity<Deal> updateDeals(@RequestBody Deal deals, @PathVariable Long id) throws Exception {
        Deal updatedDeals = dealService.updateDeal(deals, id);
        return ResponseEntity.ok(updatedDeals);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDeals(@PathVariable Long id) throws Exception {
        dealService.deleteDeal(id);
        ApiResponse apiResponse = new ApiResponse();
        apiResponse.setMessage("Deal deleted successfully");
        return new ResponseEntity<>(apiResponse, HttpStatus.ACCEPTED);
    }
}
