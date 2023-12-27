import React, { useState } from 'react';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
const model="gpt-3.5-turbo"

const GameIdeaGenerator = () => {
  const [generatedIdea, setGeneratedIdea] = useState('');
  const [loading, setLoading] = useState(false);

  const generateIdea = async () => {
    setLoading(true);

    try {
      const response = await  openai.chat.completions.create({
        model: model,
        messages: [
          {
            "role": "system",
            "content": "You will be provided with game category \
                        seed words and your task is to generate game ideas"
          },
          {
            "role": "user",
            "content": "seed words: roguelike, archery, sinister"
          }
        ],
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1,
      });

      setGeneratedIdea(response.choices[0].text.trim());
    } catch (error) {
      console.error('Error generating game idea:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Game Idea Generator</h1>
      <button onClick={generateIdea} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Game Idea'}
      </button>
      {generatedIdea && (
        <div>
          <h2>Generated Idea:</h2>
          <p>{generatedIdea}</p>
        </div>
      )}
    </div>
    
  );
};

export default GameIdeaGenerator;