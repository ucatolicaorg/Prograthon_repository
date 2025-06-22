#include "Equipo.h"
#include <sstream>

Equipo::Equipo(std::string nombre, std::string universidad) 
    : nombre(nombre), universidad(universidad), problemasResueltos(0) {}

void Equipo::resolverProblema() {
    problemasResueltos++;
}

std::string Equipo::getInfo() const {
    std::ostringstream ss;
    ss << "Equipo: " << nombre 
       << " | Universidad: " << universidad
       << " | Problemas resueltos: " << problemasResueltos;
    return ss.str();
}

std::string Equipo::getNombre() const {
    return nombre;
}

int Equipo::getProblemasResueltos() const {
    return problemasResueltos;
}