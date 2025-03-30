import axios from "axios";

const apiURL = "https://newsapi.org/v2/top-headlines";

async function getNews() {
  try {
    const response = await axios.get(apiURL, {
      params: {
        country: "us",
        apiKey: process.env.NEWS_API,
      },
    });

    const article = response.data.articles;
    const simplifiedArticle = article.map((article) => ({
      title: article.title,
      description: article.description,
    }));
    return simplifiedArticle;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export default getNews;