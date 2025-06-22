#include "Problema.h"
#include <sstream>

Problema::Problema(std::string id, std::string dificultad, int tiempoLimite) 
    : id(id), dificultad(dificultad), tiempoLimite(tiempoLimite) {}

std::string Problema::getInfo() const {
    std::ostringstream ss;
    ss << "Problema " << id 
       << " | Dificultad: " << dificultad 
       << " | Tiempo: " << tiempoLimite << " min";
    return ss.str();
}

std::string Problema::getDificultad() const {
    return dificultad;
}