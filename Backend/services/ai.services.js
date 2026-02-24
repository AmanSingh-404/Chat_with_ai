const { GoogleGenAI } = require("@goole/genai")
const { model } = require("mongoose")

const ai = new GoogleGenAI({})

async function genrateResponse(prompt) {
    const response = await ai.models.genrateContent({
        model:"gemini-3-flash-preview",
        contents: content
    })
    return response.text;
}

module.exports = {
    genrateResponse
}