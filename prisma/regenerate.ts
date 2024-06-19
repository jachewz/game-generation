import prisma from '../lib/prisma'
import { type Game } from '@prisma/client'
import fs from 'fs'
import { openai } from '../lib/openai'
import path from 'path'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('process.env.OPENAI_API_KEY is not defined. Please set it.')
}

if (!process.env.POSTGRES_URL) {
  throw new Error('process.env.POSTGRES_URL is not defined. Please set it.')
}

const numberOfIdeas = 1;

async function main() {
  try {
    const firstIdea = await prisma.game.findFirst({
      where: {
        id: numberOfIdeas,
      },
    })
    if (firstIdea) {
      console.log('Idea database already seeded!')
      return
    }
  } catch (error) {
    console.error('Error checking if enough ideas exists in the database.')
    throw error
  }

  const fp = path.join(__dirname, "./game-idea-format.json");
  const gameIdeaFormat = fs.readFileSync(fp, 'utf-8');

  for (let i = 0; i < numberOfIdeas; i++) {
    await generateIdea(gameIdeaFormat).then(async result => {

      if (result) {
        const idea = JSON.parse(result);

        if (hasAllProperties(idea, JSON.parse(gameIdeaFormat))) {
          console.log("Idea has all expected properties.");
          await prisma.game.create({
            data: idea
          });
        } else {
          console.log("Idea is missing some expected properties.");
        }
      } else {
        console.log('null result');
      }
    });
    await new Promise((r) => setTimeout(r, 500)); // Wait 500ms between requests;
  }

  console.log('Database seeded!')
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

async function generateIdea(format: string) {
  console.log(`Generate a new game idea with format: \
  ${format}`);
  try {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        "role": "user",
        "content": `Generate original new game with format: \
                       ${format}`
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
    top_p: 1,
  });
  console.log(response.choices[0].message.content);
  console.log(`prompt tokens: ${response.usage?.prompt_tokens}`);
  console.log(`completion tokens: ${response.usage?.completion_tokens}`);
  console.log(`total tokens: ${response.usage?.total_tokens}`);
  return response.choices[0].message.content;
} catch (error) {
  console.log("error generating idea");  
} 
  return "An error occurred";
}

function hasAllProperties(jsonObject: Record<string, any>, expectedProperties: Record<string, any>): boolean {
  const objectKeys = Object.keys(jsonObject);
  const missingProperties = Object.keys(expectedProperties).filter(prop => !objectKeys.includes(prop));

  return missingProperties.length === 0;
}
