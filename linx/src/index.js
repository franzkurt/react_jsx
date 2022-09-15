import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { useState } from "react"

let previsao = {}

export const Form = () => {
    const [cidade, setcityName] = useState("")
    const [estado, setestadoName] = useState("")
    const [Pais, setPais] = useState("")

    interface FormDataType {cidade:string, estado: string, Pais: string}
    const responseBody: FormDataType = {city: "", state: "", country: ""}

    const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        responseBody.city = cidade
        responseBody.state = estado
        responseBody.country = Pais
        fetch('http://127.0.0.1:8000/previsao/'+JSON.stringify(responseBody)).then(retorno=> retorno.json()).then(a=> exibePrevisao(a))

    }
    const inputChangeHandler = (setFunction: React.Dispatch<React.SetStateAction<string>>, event: React.ChangeEvent<HTMLInputElement>) => {
        setFunction(event.target.value)
    }
  
    return(
        <div class="container">
            <form onSubmit={onSubmitHandler} class="form-inline">
                <div class="form-group"><label htmlFor="first_name">Cidade</label></div>
                <div><input class="form-control w-75" id="first_name" onChange={(e)=>inputChangeHandler(setcityName, e)} type="text"/></div>
                <div class="form-group"><label htmlFor="last_name">Sigla do Estado</label></div>
                <div><input class="form-control w-75" id="last_name" onChange={(e)=>inputChangeHandler(setestadoName, e)} type="text"/></div>
                <div class="form-group"><label htmlFor="Pais">Sigla do País</label></div>
                <div><input id="Pais" class="form-control w-75" onChange={(e)=>inputChangeHandler(setPais, e)} type="text"/></div>
                <input type="submit"/>
            </form>
        </div>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Form />
  </React.StrictMode>
);

function exibePrevisao(retorno_api) {

    // console.log(retorno_api)
    const list = retorno_api.list

    const ComplexList = () => (
    <div class="container">
        <div class="row">
                {list.map(item => (
                    <div class="col">
                      <ul class="list-group">
                          <li key={item.main.temp} class="list-group-item">
                          <li class="list-group-item active">{item.dt_txt}</li>
                            <div>Humidade: {item.main.humidity}</div>
                            <div>Temp. Máxima: {item.main.temp_max}</div>
                            <div>Temp. Mínima: {item.main.temp_max}</div>
                            <div>Descrição: {item.weather[0].description}</div>
                          </li>
                      </ul>
                      </div>
                ))}
          </div>
      </div>
    );

    const root2 = ReactDOM.createRoot(document.getElementById('root2'));
    root2.render(
      <React.StrictMode>
        <ComplexList />
      </React.StrictMode>
    );

}


function exibeHistorico(historico) {
    console.log(historico)
    const ComplexList = () => (
    <div class="container">
        {historico.map(item => (
          <ul class="list-group">
            <div>{item.timestamp}</div>
            <div>Query: {item.consulta}</div>
          </ul>
        ))}
      </div>
    );

    const root3 = ReactDOM.createRoot(document.getElementById('root3'));
    root3.render(
      <React.StrictMode>
        <ComplexList />
      </React.StrictMode>
    );

}
fetch('http://127.0.0.1:8000/historico/').then(retorno=> retorno.json()).then(a=> exibeHistorico(a))

