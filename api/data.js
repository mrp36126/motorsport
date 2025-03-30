// api/data.js
const fetch = require('node-fetch');

const githubBaseUrl = "https://raw.githubusercontent.com/mrp36126/motorsport/main/data/";
const categories = ["zwartkops", "ultimate", "rock", "mahem", "f1", "intRugby", "driverStandings", "constructorStandings"];

module.exports = async (req, res) => {
    try {
        const data = {};
        for (const category of categories) {
            const response = await fetch(`${githubBaseUrl}${category}.csv`);
            if (!response.ok) throw new Error(`Failed to fetch ${category}.csv`);
            data[category] = await response.text();
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
