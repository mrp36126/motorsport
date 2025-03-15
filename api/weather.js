export default async function handler(req, res) {
    const apiKey = process.env.WEATHER_API_KEY;
    const locations = ["Pretoria,ZA", "Vereeniging,ZA", "Brakpan,ZA", "Melbourne,AU"]; // Added Melbourne for F1

    try {
        const weatherData = await Promise.all(
            locations.map(async (location) => {
                try {
                    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`Failed to fetch ${location}`);
                    const data = await response.json();
                    return {
                        location: location,
                        temp: data.main.temp,
                        description: data.weather[0].description,
                    };
                } catch (error) {
                    console.error(`Error fetching ${location}:`, error);
                    return { location: location, error: "Weather unavailable" };
                }
            })
        );
        res.status(200).json(weatherData);
    } catch (error) {
        console.error("Weather API error:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
}
