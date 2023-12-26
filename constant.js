// Function to extract username from GitHub profile link
function extractUsernameFromLink(profileLink) {
  const match = profileLink.match(/https:\/\/github.com\/([^\/]+)/);
  return match ? match[1] : null;
}

module.exports = {
  extractUsernameFromLink,
};