# /usr/bin/env python3
# Done by Franz Gastring

import json
import requests
import urllib
import psycopg2
import psycopg2.extras

from typing import Union
from string import Template
from pydantic import BaseModel

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Para evitar CORS deny
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def main_cities():
    resp = []
    # template permite ustilizar a mesma url alterando apenas as variaveis com cifrão '$' -> $city e $country
    fixed = Template('https://api.openweathermap.org/data/2.5/weather?q=$city,$country&APPID=b5812747ac712899d1de32c68ba565fd')

    principais_cidades = [('Paris','fr'),('Sao Paulo','br'),('London','uk')]
    for city, country in principais_cidades:

        url = fixed.substitute({"city":city,"country":country})
        response = requests.get(url)
        # print(response.text)
        resp.append(response.text)

    # retorna um array com as cidades
    return resp

@app.get("/previsao/{localidade}")
def previsao_localidade(localidade: Union [str, str, str] = None):
    # para dar "unescape" na url
    form_data = json.loads(urllib.parse.unquote(localidade, encoding='utf-8', errors='replace'))
    
    # uso a  geo api pra pegar os dados "latitude" e "longitude" e substituir usando Template
    geo_url = Template('https://api.openweathermap.org/geo/1.0/direct?q=$city,$state,$country&limit=1&appid=b5812747ac712899d1de32c68ba565fd')
    url = geo_url.substitute(**form_data)

    resp = requests.get(url).json()[0]
    previsao_url = f'https://api.openweathermap.org/data/2.5/forecast?lat={resp["lat"]}&lon={resp["lon"]}&lang=pt_br&cnt=4&unit=metric&appid=b5812747ac712899d1de32c68ba565fd'
    
    final = requests.get(previsao_url).json()
    print(final)
    return final

class postgres:
    # Cria uma database connection
    DB_SETTINGS = {'host':'localhost','port':'5433', 'database':'linx','user':'postgres','password':'password'}
    
    # conecta ao banco criado 
    def __init__(self, db):
        self.conn = psycopg2.connect(**self.DB_SETTINGS)
        # para garantir que o execute seja permanente
        self.conn.autocommit = True


# TODO: adicionar begin/commit e rollback caso nao funcione a trasaçao conforme esperado
@app.get("/insere_historico/{consulta}")
def db_insere(consulta: str):
    
    # Abre um cursor e insere a consulta
    db_conn = postgres()
    with db_conn.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        
        # importante para aevitar sql injection
        sql = cur.mogrify("insert into historic (consulta) values (%s);",(consulta,))

        # print(sql)
        cur.execute(sql)

        # garante o status INSERT 0 1
        if cur.rowcount != 1:
            return {'nao ok'}
        return {'ok'}

@app.get("/historico")
def db_consulta():    
    db_conn = postgres()
    with db_conn.conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute("select * from historic;")
        consultas_realizadas = cur.fetchall()
        return consultas_realizadas
