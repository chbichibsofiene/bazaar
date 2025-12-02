package com.bazar.service.impl;

import com.bazar.model.Seller;
import com.bazar.model.SellerReport;
import com.bazar.repository.SellerReportRepository;
import com.bazar.service.SellerReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

@Service
@RequiredArgsConstructor
public class SellerReportImpl implements SellerReportService {
    private final SellerReportRepository sellerReportRepository;

    @Override
    public SellerReport getSellerReport(Seller seller) throws Exception {
        SellerReport sellerReport = sellerReportRepository.findBySellerId(seller.getId());
        if (sellerReport == null) {
            SellerReport newReport = new SellerReport();
            newReport.setSeller(seller);
            return sellerReportRepository.save(newReport);
        }
        return sellerReport;
    }

    @Override
    public SellerReport updateSellerReport(SellerReport sellerReport) {
        return sellerReportRepository.save(sellerReport);
    }
}
