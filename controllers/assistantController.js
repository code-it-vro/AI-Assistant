import searchWikipedia from "../services/wikipediaService.js";
import getResponse from "../services/llmServices.js";
import getNews from "../services/newsService.js";
import say from "say";
import opn from "opn";

export async function virtualAssistant(req, res) {
  try {
    let { text } = req.body;
    text = text.toLowerCase();
    console.log(text);

    let clearText = text
      .replace(/\b(please|now|can you|kindly)\b/gi, "")
      .trim();

    if (clearText.includes("search on wikipedia")) {
      let searchQuery = clearText.replace("search on wikipedia", "").trim();
      if (searchQuery) {
        const wikipediaData = await searchWikipedia(searchQuery);
        if (wikipediaData && wikipediaData.content) {
          console.log(wikipediaData.content);
          await say.speak(wikipediaData.content);
          res.status(200).json({ message: wikipediaData.content });
        } else {
          res.status(400).json({ message: "unable to process your query." });
        }
      } else {
        res.status(400).json({ message: "unable to process your query." });
        say.speak("unable to process your query.");
      }
    } else if (clearText.includes("open youtube")) {
      say.speak("Opening Youtube");
      opn("https://www.youtube.com/");
    } else if (clearText.includes("open github")) {
      say.speak("Opening github");
      opn("https://github.com/");
    } else if (clearText.includes("open instagram")) {
      say.speak("Opening instagram");
      opn("https://www.instagram.com/");
    } else if (clearText.includes("open facebook")) {
      say.speak("Opening facebook");
      opn("https://www.facebook.com/");
    } else if (clearText.includes("open google")) {
      say.speak("Opening google");
      opn("https://www.google.com/");
    } else if (clearText.includes("open chrome")) {
      say.speak("Opening chrome");
      opn("https://www.google.com/");
    } else if (clearText.includes("open twitter")) {
      say.speak("Opening x");
      opn("https://www.x.com/");
    } else if (clearText.includes("open x")) {
      say.speak("Opening x");
      opn("https://www.x.com/");
    } else if (clearText.includes("open linkedin")) {
      say.speak("Opening linkedin");
      opn("https://www.linkedin.com/");
    } else if (clearText.includes("open stack overflow")) {
      say.speak("Opening stack overflow");
      opn("https://stackoverflow.com/");
    } else if (clearText.includes("news")) {
      const newsData = await getNews();
      if (newsData && newsData.length > 0) {
        console.log(newsData[1].title);
        await say.speak(newsData[1].title);
        res.status(200).json({ message: newsData[1].title });
      } else {
        res.status(400).json({ message: "unable to process your query." });
      }
    }
    else{
      const response = await getResponse(clearText);
      console.log(response);
      await say.speak(response);
      res.status(200).json({ message: response });
    }

    // const { prompt } = req.body;
    // const llmResponse = await getResponse(prompt);
    // res.status(200).json({response: llmResponse});

    // const news  = await getNews();
    // res.json(news[0].title);
    // console.log(news);

    // const { query, maxLines } = req.body;
    // if (!query) {
    //   return res.status(400).json({ error: "Query is required" });
    // }
    // const result = await searchWikipedia(
    //   query,
    //   maxLines ? parseInt(maxLines) : 8
    // );
    // res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
