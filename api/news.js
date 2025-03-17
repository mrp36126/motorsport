export default async function handler(req, res) {
    const apiKey = process.env.MEDIASTACK_API_KEY; // Use Mediastack API key from environment

    // Check if API key is missing
    if (!apiKey) {
        console.error("MEDIASTACK_API_KEY is not set in environment variables");
        return res.status(500).json({ error: "API key is missing or not configured" });
    }

    const url = `https://api.mediastack.com/v1/news?access_key=${apiKey}&countries=za&categories=general&limit=20`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Mediastack doesn't have a "status" field like NewsAPI; check for "data" array
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error("Mediastack API error: Invalid response format or no data");
        }

        // Log the number of articles for debugging
        console.log(`Fetched ${data.data.length} news articles`);

        res.status(200).json(data); // Return the full Mediastack response
    } catch (error) {
        console.error("News API error:", error.message);
        res.status(500).json({ error: `Failed to fetch news data: ${error.message}` });
    }
}
