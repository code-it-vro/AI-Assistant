import searchWikipedia from "../services/wikipediaService.js";
import getResponse from "../services/llmServices.js";
import getNews from "../services/newsService.js";
import say from "say";
import opn from "opn";

let shouldStopSpeaking = false; // Flag to track stop requests

export async function virtualAssistant(req, res) {
   try {
     let { text, stop } = req.body;
     console.log("Received request body:", req.body);

     // Handle Stop Request
     if (stop) {
       shouldStopSpeaking = true;
       say.stop(); // Immediately stop speech
       return res.status(200).json({ message: "Speech stopped" });
     }

     if (!text) {
       return res.status(400).json({ error: "Text input is required" });
     }

     shouldStopSpeaking = false; // Reset flag for new requests
     text = text.toLowerCase();

     let clearText = text
       .replace(/\b(please|now|can you|kindly)\b/gi, "")
       .trim();

     if (clearText.includes("search on wikipedia")) {
       let searchQuery = clearText.replace("search on wikipedia", "").trim();
       if (searchQuery) {
         const wikipediaData = await searchWikipedia(searchQuery);
         if (wikipediaData && wikipediaData.content) {
           console.log(wikipediaData.content);
           if (!shouldStopSpeaking) await say.speak(wikipediaData.content);
           res.status(200).json({ message: wikipediaData.content });
         } else {
           res.status(400).json({ message: "unable to process your query." });
         }
       } else {
         res.status(400).json({ message: "unable to process your query." });
         if (!shouldStopSpeaking) say.speak("unable to process your query.");
       }
     } else if (clearText.includes("open youtube")) {
       if (!shouldStopSpeaking) say.speak("Opening Youtube");
       opn("https://www.youtube.com/");
     } else if (clearText.includes("open github")) {
       if (!shouldStopSpeaking) say.speak("Opening github");
       opn("https://github.com/");
     } else if (clearText.includes("open instagram")) {
       if (!shouldStopSpeaking) say.speak("Opening instagram");
       opn("https://www.instagram.com/");
     } else if (clearText.includes("open facebook")) {
       if (!shouldStopSpeaking) say.speak("Opening facebook");
       opn("https://www.facebook.com/");
     } else if (clearText.includes("open google")) {
       if (!shouldStopSpeaking) say.speak("Opening google");
       opn("https://www.google.com/");
     } else if (clearText.includes("open chrome")) {
       if (!shouldStopSpeaking) say.speak("Opening chrome");
       opn("https://www.google.com/");
     } else if (
       clearText.includes("open twitter") ||
       clearText.includes("open x")
     ) {
       if (!shouldStopSpeaking) say.speak("Opening X");
       opn("https://www.x.com/");
     } else if (clearText.includes("open linkedin")) {
       if (!shouldStopSpeaking) say.speak("Opening linkedin");
       opn("https://www.linkedin.com/");
     } else if (clearText.includes("open stack overflow")) {
       if (!shouldStopSpeaking) say.speak("Opening stack overflow");
       opn("https://stackoverflow.com/");
     } else if (clearText.includes("news")) {
       const newsData = await getNews();
       if (newsData && newsData.length > 0) {
         console.log(newsData[1].title);
         if (!shouldStopSpeaking) await say.speak(newsData[1].title);
         res.status(200).json({ message: newsData[1].title });
       } else {
         res.status(400).json({ message: "unable to process your query." });
       }
     } else {
       const response = await getResponse(clearText);
       console.log(response);
       if (!shouldStopSpeaking) await say.speak(response);
       res.status(200).json({ message: response });
     }
   } catch (error) {
     console.log(error);
     res.status(500).json({ error: "Internal server error" });
   }
}
