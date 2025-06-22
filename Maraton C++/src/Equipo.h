#ifndef EQUIPO_H
#define EQUIPO_H

#include <string>

class Equipo {
private:
    std::string nombre;
    std::string universidad;
    int problemasResueltos;

public:
    Equipo(std::string nombre, std::string universidad);
    
    void resolverProblema();
    std::string getInfo() const;
    
    std::string getNombre() const;
    int getProblemasResueltos() const;
};

#endif