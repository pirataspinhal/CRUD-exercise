# CRUD-exercise
This is a project to exercise serving a full CRUD service.

## Requirements

You will need **docker** and **docker-compose** to run this application.

It was developed under *Docker version 18.09.3* and *docker-compose version 1.23.2*

## Getting up and running

To run this server just type
```
./serve_environment.sh
```
at the root of the project. This will start the project and initialize the DB with the necessary data.

## Getting the server down
To stop the containers just run the following command at the root of the project
```
./shutdown_environment.sh
```
it will kill all containers.

## Code Structure (*under development*)

This section is under development and will grow/get better.

The server code are located under *./service* folder. \
The *./scripts* folder contains the necessary script to run inside the mongo docker container.

## API
Today we only have one API running, to insert a card. \
If you want to insert a card you just need to send a *POST* request to
```
localhost:8081/cards
```
with a body that are similar to the following
```
{
  name: 'TRUCO LADRÂO',
  imageUrl: 'imagem.de.teste.com',
  cardType: 'Monster',
  type: 'Neutral',
  lore: 'Monstro criado a partir de uma partida de truco muito louca entre uma galera no bar',
  properties: ['Rare', 'Special'],
}
```
