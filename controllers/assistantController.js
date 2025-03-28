import searchWikipedia from "../services/wikipediaService.js";

export async function virtualAssistant(req, res) {
  try {
    const { query, maxLines } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }
    const result = await searchWikipedia(
      query,
      maxLines ? parseInt(maxLines) : 8
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
