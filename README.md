
# GitHubStats_Viewer

The task involves fetching and displaying the CONTRIBUTION GRAPH from any GitHub profile link. This will help us assess your skills in working with us and displaying images on a web page.

Task Instructions:
1. Retrieve Contribution graph of a user's from their profile link.
2. Implement functionality to extract and display the repository image on a web page.

## Authors

- [@Nidhi](https://www.github.com/Anidhi2020)


## Deployment

To deploy this project run

Install these dependencies using 

```bash
  npm install dotenv axios express
```

```bash
  node app.js
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

Make .env File

`GITHUB_ACCESS_TOKEN=Your_github_access_token`

`PORT=3000` By default 3000 already taken in code

`END_POINT=https://api.github.com/graphql`


## API Reference

#### Get : It give user common details which is mention below in output . 

```http
  GET http://localhost:3000/fetchUserData?profileLink=git_profileLink
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `git_profileLink` | `string` | **Required**. Your Github Profile_link || 

For testing my profile_link is taken  : https://github.com/Anidhi2020 


## Output (get):

"username": "Anidhi2020",

"name": "No Name Set By User",

"avatar": "https://avatars.githubusercontent.com/u/103260993?v=4",

"contributionGraphUrl": "https://github.com/Anidhi2020",

"repositories":{
}




#### Post : it gives us last one year contribution along  with count in each months . 

```http
  POST http://localhost:3000/fetchContributionGraph
```

1. pass this in profile link in body raw(json):

      {
         "profileLink": "https://github.com/Anidhi2020"
      }

2. Also  need to set bearer_token . 
bearer_token is your personal github account token

# Output (post)

{
    "totalContributions": 9,
    
    "weeklyContributions": [
        {
            "contributionDays": [
                {
                    "contributionCount": 0,
                    "date": "2022-12-25"
                },
                {
                    "contributionCount": 0,
                    "date": "2022-12-26"
                },
                ........
            ]
        }
}            


## Demo (Below are Curl Link of Postman)

Get Curl :

curl --location 'http://localhost:3000/fetchUserData?profileLink=https%3A%2F%2Fgithub.com%2FAnidhi2020'


Post Curl :

curl --location 'http://localhost:3000/fetchContributionGraph' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer your bearer_token' \
--data '{
  "profileLink": "https://github.com/Anidhi2020"
}'


Note : Replace your bearer_token with your personal bearer token in this curl.