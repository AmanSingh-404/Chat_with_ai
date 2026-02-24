const { GoogleGenAI } = require("@goole/genai")
const { model } = require("mongoose")

const ai = new GoogleGenAI({})

async function genrateResponse(prompt) {
    const response = await ai.models.genrateContent({
        model:"gemini-2.0-flash",
        contents: content
    })
    return response.text;
}

module.exports = {
    genrateResponse
}