export default async function handler(req, res) {
    const apiKey = process.env.NEWS_API_KEY;

    // Check if API key is missing
    if (!apiKey) {
        console.error("NEWS_API_KEY is not set in environment variables");
        return res.status(500).json({ error: "API key is missing or not configured" });
    }

    const url = `https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== "ok") {
            throw new Error(`NewsAPI error: ${data.message || "Unknown error"}`);
        }

        // Log the number of articles for debugging
        console.log(`Fetched ${data.articles.length} news articles`);

        res.status(200).json(data);
    } catch (error) {
        console.error("News API error:", error.message);
        res.status(500).json({ error: `Failed to fetch news data: ${error.message}` });
    }
}
