package com.bazar.service;

import com.bazar.model.Seller;
import com.bazar.model.SellerReport;

public interface SellerReportService {
    SellerReport getSellerReport(Seller seller) throws Exception;
    SellerReport updateSellerReport(SellerReport sellerReport);

}
