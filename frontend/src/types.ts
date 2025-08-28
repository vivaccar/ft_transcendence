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

export interface Game {
	result: "Win" | "Loss";
	you: number;
	friend: number;
	friendName: string;
	touchesOpponent: number;
	touchesUser: number;
	dateTime: Date;
}