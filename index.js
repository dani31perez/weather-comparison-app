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

        const weatherData = await Promise.all(weatherPromises).catch(e =>resultDiv.innerHTML = ` <div class="alert alert-primary margin-result"><${error.message}</div>`);

        let htmlData = "";
        weatherData.map(data =>
            htmlData += `
                 <div class="card">
                    <div class="card-body card-primary card-city">
                        <h5 class="card-title">${data.name}, ${data.sys.country}</h5>
                        <p class="card-text"> ${data.main.temp}°C</p>
                        <p class="card-text "> ${data.weather[0].description}</p>
                        <p class="card-text">Humidity: ${data.main.humidity}%</p>
                    </div>
                </div>
                `);

        resultDiv.innerHTML = htmlData;

    } catch (error) {
        resultDiv.innerHTML = ` <div class="alert alert-primary margin-result"><${error.message}</div>`
    }



})