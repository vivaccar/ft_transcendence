import type { UserStats, Game } from "../types";
import { API_ROUTES } from "../config";

export async function getUserStats(): Promise<UserStats> {
	const username = sessionStorage.getItem('username');

	const statsRes= await fetch(API_ROUTES.getWinsAndLosses(username!));
	if(!statsRes.ok) {
		throw new Error("Failed to fetch wins ans losses");
	}
	const statsdata: UserStats = await statsRes.json();
	
	return statsdata;
}

export async function getMatches(): Promise<Game[]> {
	const username = sessionStorage.getItem('username');

	try {
	  const response = await fetch(API_ROUTES.getMatches(username!), {
		method: "GET",
		headers: {
		  "Content-Type": "application/json",
		},
	  });
	  
	  if (!response.ok) {
		throw new Error(`Erro ao buscar partidas: ${response.status}`);
	  }
  
	  const data = await response.json();
  
	  const games = data.matches.map((match: any) => ({
		result: match.result === "win" ? "Win" : "Loss",
		you: match.goalsUser,
		friend: match.goalsOpponent,
		friendName: match.opponent,
		// date: new Date(match.dateTime),
	  }));
  
	  return games;
	} catch (error) {
	  console.error("Erro em getMatches:", error);
	  return [];
	}
  }