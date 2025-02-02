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

        const weatherData = await Promise.all(weatherPromises).catch(e => { throw new Error("City not found") });

        let htmlData = "";
        weatherData.map(data =>
            htmlData += `
                 <div class="card card-city">
                    <div class="card-body card-primary">
                        <h4 class="card-title fw-bolder">
                        ${data.name},
                         ${data.sys.country}
                         <i class="fa-solid fa-globe text-secondary ms-1"></i>
                         </h4>
                        <p class="card-text fw-semibold mb-2"> 
                            <i class="fa-solid fa-temperature-low text-danger"></i>
                            ${data.main.temp}°C
                        </p>
                        <p class="card-text mb-2"> 
                        <i class="fa-solid fa-cloud text-primary"></i>
                        ${data.weather[0].description}
                        </p>
                        <p class="card-text">
                        <i class="fa-solid fa-droplet text-info"></i>
                        Humidity: ${data.main.humidity}%</p>
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
                borderWidth: 1,
                backgroundColor: [
                    'rgba(72, 202, 228, 0.6)',
                    'rgba(3, 169, 244, 0.6)',
                    'rgba(0, 131, 143, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(0, 190, 172, 0.6)',
                    'rgba(255, 193, 7, 0.6)'
                ],
                borderColor: [
                    'rgba(72, 202, 228, 1)',
                    'rgba(3, 169, 244, 1)',
                    'rgba(0, 131, 143, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(0, 190, 172, 1)',
                    'rgba(255, 193, 7, 1)'
                ],
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