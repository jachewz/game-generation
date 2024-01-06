// actions.tsx

'use server'

import prisma from '@/lib/prisma'
import { openai } from '@/lib/openai'
import { type Game } from '@prisma/client'
import { ratelimit } from '@/lib/utils'

export async function getGames(
  category?: string
  ) : Promise<Array<Game>> {
  try {
    const { success } = await ratelimit.limit('generations');
    if (!success) throw new Error('Rate limit exceeded');

    const games = await prisma.game.findMany({
    });
    return games as Array<Game>;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function upvoteGame(gameId: number): Promise<Game> {
  try {
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        upvotes: {
          increment: 1,
        }
      },
    });

    return updatedGame;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function downvoteGame(gameId: number): Promise<Game> {
  try {
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: {
        downvotes: {
          increment: 1,
        }
      },
    });

    return updatedGame;
  } catch (error) {
    console.error(error);
    throw error;
  }
}