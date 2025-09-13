import type { UserStats,UserGoals, Game } from "../types";
import { API_ROUTES } from "../config";

export async function getUserStats(username: string | null): Promise<UserStats> {

	const statsRes= await fetch(API_ROUTES.getWinsAndLosses(username!));
	if(!statsRes.ok) {
		throw new Error("Failed to fetch wins ans losses");
	}
	const statsdata: UserStats = await statsRes.json();
	
	return statsdata;
}

export async function getUserGoals(username: string | null): Promise<UserGoals> {

	const statsRes= await fetch(API_ROUTES.getGoals(username!));
	if(!statsRes.ok) {
		throw new Error("Failed to fetch goals");
	}
	const statsdata: UserGoals = await statsRes.json();
	
	return statsdata;
}

export async function getMatches(username: string | null): Promise<Game[]> {

	try {
	  const response = await fetch(API_ROUTES.getMatches(username!), {
		method: "GET",
		headers: {
		  "Content-Type": "application/json",
		},
	  });
	  
	  if (!response.ok) {
		throw new Error(`Error while searching for matches: ${response.status}`);
	  }
  
	  const data = await response.json();
  
	  const games = data.matches.map((match: any) => ({
		result: match.result === "win" ? "Win" : "Loss",
		youName: match.user,
		you: match.goalsUser,
		friend: match.goalsOpponent,
		friendName: match.opponent,
		touchesOpponent: match.touchesOpponent,
		touchesUser: match.touchesUser,
		dateTime: new Date(match.dateTime),
	  })).sort((a: { dateTime: Date }, b: { dateTime: Date }) => b.dateTime.getTime() - a.dateTime.getTime());
	  return games;
	} catch (error) {
	  console.error("Error in getMatches:", error);
	  return [];
	}
}