export interface loginCredentials {
	username: string;
	password: string;
}

export interface registerCredentials {
	email: string;
	username: string;
	password: string;
}

export interface UserStats {
	wins: number;
	losses: number;
}

export interface UserGoals {
	goalsPro: number;
	goalsCon: number;
}
export interface Game {
	result: "Win" | "Loss";
	youName: string;
	you: number;
	friend: number;
	friendName: string;
	dateTime: Date;
}