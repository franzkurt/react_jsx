Utilizadno a API de 5 dias é possivel ver o tmepo com 3h de diferença num total de 40 pontos no JSON
	Meu token: b5812747ac712899d1de32c68ba565fd
	Endpoint: http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=b5812747ac712899d1de32c68ba565fd
	Observações: 
		- Adicionei a linguagem brasileira com "&lang=pt_br" como indicado na documentação para ver "tempo nublado" ao invés de "cloudy"
		- Adicionei a unidade celsius com "&units=metric" como indicado na documentação para ver "32" ao invés de "89.6"
		- converti o unix para uma data mais "humana" com a função "new Date(list[0].dt * 1000)"

Como a API usa latitude ao inves do nome da cidade utilizei uma API da mesma organização que permite converter cidade pra lat/long
	Endpoint: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
	Endpoint com token: https://api.openweathermap.org/geo/1.0/direct?q=porto%20alegre,RS,BR&limit=1&appid=b5812747ac712899d1de32c68ba565fd

Swagger
http://127.0.0.1:8000/docs

Principais arquivos
	Script de instalação	-> steps.txt
	Servidor Python FastAPI -> main.py
	logica do ReactJS 		-> src/app.js
	template da pagina 		-> public/index.html

	Obs: adicionei bootstrap como css para melhorar a aparência

Rodar backend (dentro da pasta react)
	- Utilizar o comando "python3 -m uvicorn main:app --reload"

Rodar frontend (dentro da pasta react/linx)
	- Rodar o comando "npm start" para compilar e startar o servidor da aplicação react 

