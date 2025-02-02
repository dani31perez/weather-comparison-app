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
        if (city.includes(",")) {
            const cityNames = city.split(",").map(city => city.trim());
            const weatherPromises = cityNames.map(async city => {
                let res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
                if (!res.ok) {
                    throw new Error("City not found");
                }
                return res.json();
            });

            
        }
    } catch (error) {
        resultDiv.innerHTML = ` <div class="alert alert-primary margin-result"><${error.message}</div>`
    }



})