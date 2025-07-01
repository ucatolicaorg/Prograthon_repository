#ifndef ALGORITMO_GENETICO_H
#define ALGORITMO_GENETICO_H

#include <vector>
#include <string>
#include <random>

struct Problema {
    std::string id;
    std::string nombre;
    int tiempoPromedio;
    int dificultad;
};

class AlgoritmoGenetico {
private:
    std::vector<Problema> datos;
    int totalProblemas;
    int popSize;
    int maxGeneraciones;
    std::mt19937 gen;
    std::uniform_real_distribution<> dis;
    
    // Métodos privados
    double fitness(const std::vector<int>& individuo);
    std::vector<int> crearIndividuo();
    std::vector<std::vector<int>> crearPoblacion();
    std::vector<std::vector<int>> seleccion(const std::vector<std::vector<int>>& poblacion, 
                                           const std::vector<double>& fitnesses);
    std::vector<int> cruza(const std::vector<int>& p1, const std::vector<int>& p2);
    std::vector<int> mutacion(std::vector<int> individuo);
    
public:
    AlgoritmoGenetico(const std::vector<Problema>& problemas, 
                     int totalObj, 
                     int tamPoblacion = 50, 
                     int maxGen = 100);
    
    std::vector<Problema> ejecutar();
};

#endif // ALGORITMO_GENETICO_H