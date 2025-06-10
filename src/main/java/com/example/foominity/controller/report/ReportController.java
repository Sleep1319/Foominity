package com.example.foominity.controller.report;

import org.springframework.web.bind.annotation.RestController;

import com.example.foominity.service.report.ReportService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@RestController
public class ReportController {

    private final ReportService reportService;
}
