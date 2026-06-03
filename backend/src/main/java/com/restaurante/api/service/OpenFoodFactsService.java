package com.restaurante.api.service;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriUtils;

import com.restaurante.api.dto.OpenFoodFactsProductDTO;
import com.restaurante.api.dto.OpenFoodFactsProductDetailDTO;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class OpenFoodFactsService {

    @Value("${openfoodfacts.api-url:https://world.openfoodfacts.org}")
    private String apiUrl;

    private final RestClient restClient = RestClient.create();

    @SuppressWarnings("unchecked")
    public List<OpenFoodFactsProductDTO> buscarProductos(String query) {
        log.info("Buscando productos en OpenFoodFacts con query: {}", query);

        String url = apiUrl + "/cgi/search.pl?search_terms=" +
                UriUtils.encode(query, StandardCharsets.UTF_8) +
                "&search_simple=1&action=process&json=1&page_size=10";

        Map<String, Object> response = restClient.get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), (request, clientResponse) -> {
                    throw new RuntimeException("Error OpenFoodFacts search: " + clientResponse.getStatusCode());
                })
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        if (response == null || !response.containsKey("products")) {
            return List.of();
        }

        Object productsRaw = response.get("products");
        if (!(productsRaw instanceof List<?> products)) {
            return List.of();
        }

        List<OpenFoodFactsProductDTO> resultado = new ArrayList<>();
        for (Object item : products) {
            if (item instanceof Map<?, ?> productMap) {
                resultado.add(mapToProductDTO((Map<String, Object>) productMap));
            }
        }
        return resultado;
    }

    private OpenFoodFactsProductDTO mapToProductDTO(Map<String, Object> product) {
        return new OpenFoodFactsProductDTO(
                (String) product.get("code"),
                (String) product.getOrDefault("product_name", product.get("product_name_en")),
                (String) product.getOrDefault("generic_name", ""),
                (String) product.getOrDefault("brands", ""),
                (String) product.getOrDefault("image_front_small_url", product.get("image_front_thumb_url"))
        );
    }

    @SuppressWarnings("unchecked")
    public OpenFoodFactsProductDetailDTO obtenerDetalle(String code) {
        log.info("Obteniendo detalle en OpenFoodFacts para el código: {}", code);

        String url = apiUrl + "/api/v0/product/" + UriUtils.encode(code, StandardCharsets.UTF_8) + ".json";

        Map<String, Object> response = restClient.get()
                .uri(url)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .onStatus(status -> !status.is2xxSuccessful(), (request, clientResponse) -> {
                    throw new RuntimeException("Error OpenFoodFacts detail: " + clientResponse.getStatusCode());
                })
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        if (response == null) {
            throw new RuntimeException("No hay respuesta de OpenFoodFacts para el código: " + code);
        }

        Object statusObj = response.get("status");
        int status = statusObj instanceof Number number ? number.intValue() : Integer.parseInt(String.valueOf(statusObj));
        if (status != 1) {
            throw new RuntimeException("Producto no encontrado en OpenFoodFacts: " + code);
        }

        Map<String, Object> product = (Map<String, Object>) response.get("product");
        if (product == null) {
            throw new RuntimeException("Producto no encontrado en OpenFoodFacts: " + code);
        }

        Map<String, Object> nutriments = (Map<String, Object>) product.get("nutriments");

        return new OpenFoodFactsProductDetailDTO(
                code,
                (String) product.getOrDefault("product_name", product.get("product_name_en")),
                (String) product.getOrDefault("generic_name", ""),
                (String) product.getOrDefault("brands", ""),
                (String) product.getOrDefault("image_front_small_url", product.get("image_front_thumb_url")),
                (String) product.getOrDefault("serving_size", ""),
                parseDecimal(nutriments, "energy-kcal_100g"),
                parseDecimal(nutriments, "proteins_100g"),
                parseDecimal(nutriments, "fat_100g"),
                parseDecimal(nutriments, "carbohydrates_100g")
        );
    }

    private BigDecimal parseDecimal(Map<String, Object> nutriments, String field) {
        if (nutriments == null || !nutriments.containsKey(field)) {
            return BigDecimal.ZERO;
        }
        return new BigDecimal(parseDouble(nutriments.get(field)));
    }

    private double parseDouble(Object value) {
        if (value == null) {
            return 0.0;
        }
        try {
            return Double.parseDouble(value.toString());
        } catch (NumberFormatException e) {
            return 0.0;
        }
    }
}
