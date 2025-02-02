const form = document.getElementById("weather-form");
const resultDiv = document.getElementById("weather-result");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const city = document.getElementById("input-cities").value.trim();
    if (!city) {
        resultDiv.innerHTML = `
        <div class="alert alert-primary margin-result">
          Please enter a valid city
        </div>
        `;
        return;
    }

    try {
        const apiKey = "ca763dd1247bd005c1248cf3dd16ab9b";

        const cityNames = city.split(",").map(city => city.trim());
        const weatherPromises = cityNames.map(async city => {
            let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
            if (!res.ok) {
                throw new Error("City not found");
            }
            return res.json();
        });

        const weatherData = await Promise.all(weatherPromises).catch(e => {throw new Error("City not found")});

        let htmlData = "";
        weatherData.map(data =>
            htmlData += `
                 <div class="card card-city">
                    <div class="card-body card-primary">
                        <h4 class="card-title fw-bolder">${data.name}, ${data.sys.country}</h4>
                        <p class="card-text fw-semibold mb-2"> ${data.main.temp}°C</p>
                        <p class="card-text mb-2"> ${data.weather[0].description}</p>
                        <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    </div>
                </div>
                `);

        resultDiv.innerHTML = htmlData;

        let cityLabels = [];
        let temperatures = [];

        weatherData.forEach(city => {
            cityLabels.push(city.name);
            temperatures.push(city.main.temp);
        });

        

          const dataChar = {
            labels: cityLabels,
            datasets: [{
              label: 'Temperature in °C',
              data: temperatures,
              borderWidth: 1
            }]
          };

          const config = {
            type: 'bar',
            data: dataChar,
            options: {
              scales: {
                y: {
                  beginAtZero: true,
                }
              },
              minBarLength: 1
            },
          };

          resultDiv.innerHTML += 
          `<canvas id="myChart" width="400" height="200"></canvas>
          `;

          const chart = document.getElementById("myChart").getContext("2d");
          new Chart(chart, config);

    } catch (error) {
        resultDiv.innerHTML = ` <div class="alert alert-primary margin-result">${error.message}</div>`
    }



})