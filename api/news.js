export default async function handler(req, res) {
    console.log("Starting /api/news handler");

    const apiKey = process.env.NEWS_API_KEY;

    // Check if API key is missing
    if (!apiKey) {
        console.error("NEWS_API_KEY is not set in environment variables");
        return res.status(500).json({ error: "API key is missing or not configured" });
    }
    console.log("API key found:", apiKey);

    const url = `https://newsapi.org/v2/top-headlines?country=us&category=sports&apiKey=${apiKey}`;
    console.log("Fetching news from URL:", url);

    try {
        const response = await fetch(url);
        console.log("Fetch response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Fetch failed with status:", response.status, "Response:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}, Response: ${errorText}`);
        }

        const data = await response.json();
        console.log("NewsAPI response status:", data.status);

        if (data.status !== "ok") {
            console.error("NewsAPI error:", data.message);
            throw new Error(`NewsAPI error: ${data.message || "Unknown error"}`);
        }

        console.log(`Successfully fetched ${data.articles.length} news articles`);
        res.status(200).json(data);
    } catch (error) {
        console.error("News API error:", error.message);
        res.status(500).json({ error: `Failed to fetch news data: ${error.message}` });
    }
}
