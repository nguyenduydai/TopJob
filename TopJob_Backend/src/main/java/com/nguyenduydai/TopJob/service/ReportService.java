package com.nguyenduydai.TopJob.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import com.itextpdf.html2pdf.ConverterProperties;
import com.itextpdf.html2pdf.HtmlConverter;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.nguyenduydai.TopJob.domain.entity.User;
import com.nguyenduydai.TopJob.util.SecurityUtil;

@Service
public class ReportService {

    private final TemplateEngine templateEngine;
    private final UserService userService;

    public ReportService(TemplateEngine templateEngine, UserService userService) {
        this.templateEngine = templateEngine;
        this.userService = userService;
    }

    public byte[] generatePdfReport(String templateName, Object data) throws IOException {
        String email = SecurityUtil.getCurrentUserLogin().isPresent() == true
                ? SecurityUtil.getCurrentUserLogin().get()
                : "";
        User user = this.userService.handleGetUserByUsername(email);
        Context context = new Context();
        context.setVariable("creator", user.getName());
        context.setVariable("date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss")));
        context.setVariable(templateName, data);
        String htmlContent = templateEngine.process(templateName, context);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(outputStream);
        PdfDocument pdfDocument = new PdfDocument(writer);
        pdfDocument.setDefaultPageSize(PageSize.A4);

        ConverterProperties converterProperties = new ConverterProperties();
        converterProperties.setBaseUri("src/main/resources/static/"); // Đường dẫn cơ sở cho tài nguyên (CSS, ảnh)

        HtmlConverter.convertToPdf(htmlContent, pdfDocument, converterProperties);

        pdfDocument.close();
        return outputStream.toByteArray();
    }
}