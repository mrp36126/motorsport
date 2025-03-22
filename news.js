// news.js

function fetchNews() {
    const url = "/api/news";
    console.log("Fetching news from proxy URL:", url);
    return fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "User-Agent": navigator.userAgent
        }
    })
        .then(response => {
            console.log("Response status:", response.status);
            console.log("Response headers:", Object.fromEntries(response.headers.entries()));
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Proxy response data:", data);
            if (!data.data || !Array.isArray(data.data)) {
                throw new Error("Mediastack API error: Invalid response format");
            }
            displayNews(data);
        })
        .catch(error => {
            console.error("News fetch error:", error);
            const newsContainer = document.getElementById("news-content");
            if (newsContainer) {
                newsContainer.innerHTML = `<p class="text-red-400">Failed to load news: ${error.message}</p>`;
            }
        });
}

function displayNews(data) {
    const newsContainer = document.getElementById("news-content");
    if (newsContainer) {
        newsContainer.innerHTML = "";
        if (data && data.data && data.data.length > 0) {
            data.data.forEach(article => {
                const title = article.title || "No title available";
                const description = article.description || "No description available";
                const url = article.url || "#";
                const source = article.source || "Unknown source";

                const newsHTML = `
                    <div class="news-card bg-gray-800 p-4 rounded-lg shadow-md text-left mb-4">
                        <h3 class="text-lg font-bold">${title}</h3>
                        <p class="text-sm text-gray-400">Source: ${source}</p>
                        <p class="text-sm">${description}</p>
                        <a href="${url}" target="_blank" class="text-blue-400 hover:underline text-sm">Read more</a>
                    </div>
                `;
                newsContainer.innerHTML += newsHTML;
            });
        } else {
            newsContainer.innerHTML = `<p class="text-gray-400">No news articles available.</p>`;
        }
    }
}
