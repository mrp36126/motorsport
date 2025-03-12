export default async function handler(req, res) {
    const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
    const locations = ["Silverstone, UK", "Monza, Italy", "Suzuka, Japan", "Daytona, USA"];

    let weatherData = [];

    for (let location of locations) {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${WEATHER_API_KEY}&units=metric`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod === 200) {
                weatherData.push({
                    name: data.name,
                    temp: data.main.temp,
                    description: data.weather[0].description,
                    wind: data.wind.speed
                });
            }
        } catch (error) {
            console.error("Error fetching weather:", error);
        }
    }

    res.status(200).json(weatherData);
}
