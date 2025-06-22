#include <iostream>
#include <vector>
#include "Equipo.h"
#include "Problema.h"

int main() {
    // Crear equipos
    std::vector<Equipo> equipos = {
        Equipo("Alfa", "Tecnologico Nacional"),
        Equipo("Beta", "Universidad del Valle")
    };
    
    // Crear problemas
    std::vector<Problema> problemas = {
        Problema("A1", "Facil", 30),
        Problema("B2", "Medio", 45),
        Problema("C3", "Dificil", 90),
        Problema("D4", "Medio", 35),
        Problema("E5", "Medio", 40),
        Problema("F6", "Dificil", 150)
        
    };
    
    // Simular maratón
    equipos[0].resolverProblema();
    equipos[0].resolverProblema();
    equipos[1].resolverProblema();
    equipos[1].resolverProblema();
    equipos[0].resolverProblema();
    equipos[0].resolverProblema();
    
    // Mostrar resultados
    std::cout << "\n=== ESTADO DE LA MARATON ===\n";
    for (const auto& equipo : equipos) {
        std::cout << equipo.getInfo() << "\n";
    }
    
    std::cout << "\n=== PROBLEMAS DISPONIBLES ===\n";
    for (const auto& problema : problemas) {
        std::cout << problema.getInfo() << "\n";
    }
    
    // Determinar ganador
    std::cout << "\n=== RESULTADO FINAL ===\n";
    const Equipo* ganador = &equipos[0];
    for (const auto& equipo : equipos) {
        if (equipo.getProblemasResueltos() > ganador->getProblemasResueltos()) {
            ganador = &equipo;
        }
    }
    std::cout << "Ganador: " << ganador->getNombre() << "!\n";
    
    return 0;
}