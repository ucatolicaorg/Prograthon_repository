#include "AlgoritmoGenetico.h"
#include <algorithm>
#include <numeric>
#include <ctime>
#include <iostream>

AlgoritmoGenetico::AlgoritmoGenetico(const std::vector<Problema>& problemas, 
                                   int totalObj, 
                                   int tamPoblacion, 
                                   int maxGen) 
    : datos(problemas), totalProblemas(totalObj), popSize(tamPoblacion), 
      maxGeneraciones(maxGen), gen(std::time(nullptr)), dis(0.0, 1.0) {
    
    if (totalProblemas > static_cast<int>(datos.size())) {
        totalProblemas = static_cast<int>(datos.size());
    }
}

double AlgoritmoGenetico::fitness(const std::vector<int>& individuo) {
    double tiempoTotal = 0.0;
    for (int idx : individuo) {
        if (idx >= 0 && idx < static_cast<int>(datos.size())) {
            tiempoTotal += datos[idx].tiempoPromedio;
        }
    }
    
    // Función de fitness: 1 / (1 + tiempo_total)
    // Mientras menor sea el tiempo, mayor será el fitness
    return 1.0 / (1.0 + tiempoTotal);
}

std::vector<int> AlgoritmoGenetico::crearIndividuo() {
    std::vector<int> indices(datos.size());
    std::iota(indices.begin(), indices.end(), 0);
    
    std::shuffle(indices.begin(), indices.end(), gen);
    
    std::vector<int> individuo(indices.begin(), indices.begin() + totalProblemas);
    return individuo;
}

std::vector<std::vector<int>> AlgoritmoGenetico::crearPoblacion() {
    std::vector<std::vector<int>> poblacion;
    poblacion.reserve(popSize);
    
    for (int i = 0; i < popSize; ++i) {
        poblacion.push_back(crearIndividuo());
    }
    
    return poblacion;
}

std::vector<std::vector<int>> AlgoritmoGenetico::seleccion(
    const std::vector<std::vector<int>>& poblacion, 
    const std::vector<double>& fitnesses) {
    
    std::vector<std::vector<int>> seleccionados;
    seleccionados.reserve(popSize);
    
    // Selección por ruleta
    double sumFitness = std::accumulate(fitnesses.begin(), fitnesses.end(), 0.0);
    
    for (int i = 0; i < popSize; ++i) {
        double r = dis(gen) * sumFitness;
        double suma = 0.0;
        
        for (size_t j = 0; j < poblacion.size(); ++j) {
            suma += fitnesses[j];
            if (suma >= r) {
                seleccionados.push_back(poblacion[j]);
                break;
            }
        }
    }
    
    return seleccionados;
}

std::vector<int> AlgoritmoGenetico::cruza(const std::vector<int>& p1, const std::vector<int>& p2) {
    std::vector<int> hijo;
    hijo.reserve(totalProblemas);
    
    // Cruza de orden (Order Crossover - OX)
    int inicio = std::uniform_int_distribution<int>(0, totalProblemas - 1)(gen);
    int fin = std::uniform_int_distribution<int>(inicio, totalProblemas - 1)(gen);
    
    // Copiar segmento del padre 1
    std::vector<bool> usado(datos.size(), false);
    for (int i = inicio; i <= fin; ++i) {
        hijo.push_back(p1[i]);
        usado[p1[i]] = true;
    }
    
    // Completar con elementos del padre 2 que no estén ya incluidos
    for (int elemento : p2) {
        if (!usado[elemento] && hijo.size() < static_cast<size_t>(totalProblemas)) {
            hijo.push_back(elemento);
            usado[elemento] = true;
        }
    }
    
    // Si aún falta completar, tomar elementos aleatorios no usados
    while (hijo.size() < static_cast<size_t>(totalProblemas)) {
        for (size_t i = 0; i < datos.size() && hijo.size() < static_cast<size_t>(totalProblemas); ++i) {
            if (!usado[i]) {
                hijo.push_back(static_cast<int>(i));
                usado[i] = true;
            }
        }
    }
    
    return hijo;
}

std::vector<int> AlgoritmoGenetico::mutacion(std::vector<int> individuo) {
    if (individuo.size() > 1 && dis(gen) < 0.1) { // 10% probabilidad de mutación
        int i = std::uniform_int_distribution<int>(0, individuo.size() - 1)(gen);
        int j = std::uniform_int_distribution<int>(0, individuo.size() - 1)(gen);
        std::swap(individuo[i], individuo[j]);
    }
    
    return individuo;
}

std::vector<Problema> AlgoritmoGenetico::ejecutar() {
    if (datos.empty() || totalProblemas <= 0) {
        return {};
    }
    
    auto poblacion = crearPoblacion();
    
    for (int generacion = 0; generacion < maxGeneraciones; ++generacion) {
        // Calcular fitness de toda la población
        std::vector<double> fitnesses;
        fitnesses.reserve(poblacion.size());
        
        for (const auto& individuo : poblacion) {
            fitnesses.push_back(fitness(individuo));
        }
        
        // Selección
        poblacion = seleccion(poblacion, fitnesses);
        
        // Cruza y mutación
        std::vector<std::vector<int>> nuevaPoblacion;
        nuevaPoblacion.reserve(popSize);
        
        for (size_t i = 0; i < poblacion.size(); i += 2) {
            if (i + 1 < poblacion.size()) {
                auto hijo1 = mutacion(cruza(poblacion[i], poblacion[i + 1]));
                auto hijo2 = mutacion(cruza(poblacion[i + 1], poblacion[i]));
                
                nuevaPoblacion.push_back(hijo1);
                nuevaPoblacion.push_back(hijo2);
            } else {
                nuevaPoblacion.push_back(mutacion(poblacion[i]));
            }
        }
        
        poblacion = nuevaPoblacion;
    }
    
    // Encontrar el mejor individuo
    std::vector<double> fitnesses;
    for (const auto& individuo : poblacion) {
        fitnesses.push_back(fitness(individuo));
    }
    
    auto mejorIt = std::max_element(fitnesses.begin(), fitnesses.end());
    int mejorIdx = std::distance(fitnesses.begin(), mejorIt);
    
    // Convertir índices a problemas
    std::vector<Problema> resultado;
    resultado.reserve(totalProblemas);
    
    for (int idx : poblacion[mejorIdx]) {
        if (idx >= 0 && idx < static_cast<int>(datos.size())) {
            resultado.push_back(datos[idx]);
        }
    }
    
    return resultado;
}