import { getApiKey } from "./apiKey.js";
import { data } from "../data/dataset.js";

export const communicateWithOpenAI = (technology, userMessage) => {
  // get the API key
  const OPENAI_API_KEY = getApiKey();

  return new Promise((resolve, reject) => {
    // check if the API key is invalid
    const technologyInfo = data.find(obj => obj.id.toLowerCase() === technology.toLowerCase());
    if (!OPENAI_API_KEY) {
      const error = new Error("ApiKey is invalid");
      return reject(error);
    }

    // create the headers
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    };

    // create the body
    const body = JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are ${technologyInfo.name}, a technology used for ${technologyInfo.description}. Answer to user queries with the role of  ${technologyInfo.name}.`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
    });

    // send the request
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: headers,
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Invalid API key");
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        }
        return response.json();
      })
      .then((data) => {
        if (data.choices && data.choices.length > 0) {
          resolve(data.choices[0].message.content); // Use message.content for chat completions
        } else {
          reject(new Error("No choices found in the response"));
        }
      })
      .catch((error) => {
        console.error("Error communicating with OpenAI:", error);
        reject(error); // Ensure errors are passed to the reject handler
      });
  });
};
