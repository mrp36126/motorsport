export default async function handler(req, res) {
    const apiKey = process.env.WEATHER_API_KEY;
    const locations = ["Silverstone,UK", "Monaco", "Suzuka,JP", "Daytona Beach,US"];
    
    try {
        const weatherData = await Promise.all(locations.map(async (location) => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            const data = await response.json();

            return {
                location: location,
                temp: data.main.temp,
                description: data.weather[0].description,
            };
        }));

        res.status(200).json(weatherData);
    } catch (error) {
        console.error("Weather API error:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
}
