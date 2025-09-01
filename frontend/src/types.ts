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
	touchesOpponent: number;
	touchesUser: number;
	dateTime: Date;
}

export interface Invites {
	requester: string;
	status: string;
}

export interface Friend {
	friend: string;
	status: string;
	isOnline: boolean;
}