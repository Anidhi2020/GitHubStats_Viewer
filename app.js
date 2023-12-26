const express = require("express");
const axios = require("axios");
const { extractUsernameFromLink } = require('./constant');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// GraphQL API for GitHub
const endpoint = process.env.END_POINT;

// GitHub personal access token
const accessToken = process.env.GITHUB_ACCESS_TOKEN;

// Function to handle POST requests for /fetchContributionGraph
app.post("/fetchContributionGraph", async (req, res) => {
  const { profileLink } = req.body;

  // Extracting the username from the GitHub profile link
  const username = extractUsernameFromLink(profileLink);

  if (!username) {
    return res.status(400).json({ error: 'Invalid GitHub profile link format' });
  }

  // GraphQL query
  const query = `
    query ($userName: String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;

  // GraphQL variables
  const variables = {
    userName: username,
  };

  // Request headers
  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  try {
    // Making GraphQL API request
    const response = await axios.post(
      endpoint,
      { query, variables },
      { headers }
    );

    // Getting contribution data
    const contributionsData =
      response.data.data.user.contributionsCollection.contributionCalendar;
    const result = {
      totalContributions: contributionsData.totalContributions,
      weeklyContributions: contributionsData.weeks,
    };

    res.json(result);
  } catch (error) {
    console.error("Error:", error.message);
    console.error(
      "Detailed error:",
      error.response ? error.response.data : "No response data"
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to handle GET requests for /fetchUserData
app.get("/fetchUserData", async (req, res) => {
  try {
    const { profileLink } = req.query;

    // Extract the username from the GitHub profile link
    const username = extractUsernameFromLink(profileLink);

    if (!username) {
      return res.status(400).json({ error: 'Invalid GitHub profile link format' });
    }

    // Fetch user data from GitHub API
    const userDataResponse = await axios.get(
      `https://api.github.com/users/${username}`
    );
    const contributionsDataResponse = await axios.get(
      `https://api.github.com/users/${username}/repos`
    );

    // Error checking
    if (
      userDataResponse.status !== 200 ||
      contributionsDataResponse.status !== 200
    ) {
      throw new Error("GitHub API Error");
    }

    const userData = userDataResponse.data;
    const repositories = contributionsDataResponse.data;

    // Extracting the contribution graph URL
    const contributionGraphUrl = `https://github.com/${username}`;

    // Response
    const response = {
      username: userData.login,
      name: userData.name || "No Name Set By User",
      avatar: userData.avatar_url,
      contributionGraphUrl: contributionGraphUrl,
      repositories: repositories.map((repo) => repo.full_name),
    };

    res.json(response);
  } catch (error) {
    console.error("Error:", error.message);
    console.error(
      "Detailed error:",
      error.response ? error.response.data : "No response data"
    );
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
