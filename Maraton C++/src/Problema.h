#ifndef PROBLEMA_H
#define PROBLEMA_H

#include <string>

class Problema {
private:
    std::string id;
    std::string dificultad;
    int tiempoLimite;

public:
    Problema(std::string id, std::string dificultad, int tiempoLimite);
    
    std::string getInfo() const;
    std::string getDificultad() const;
};

#endif