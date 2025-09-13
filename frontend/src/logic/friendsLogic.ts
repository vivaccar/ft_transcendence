import { API_ROUTES } from "../config";
import { navigate } from "../router";
import type { Invites, Friend } from "../types";
import i18next from "i18next";

export async function sendFriendInvite(friendName: string) {
	try {
		const response = await fetch(API_ROUTES.inviteFriend, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ friend: friendName }),
		});

		if (!response.ok) {
			const error = await response.json();
			alert(`❌ ${i18next.t("invite_error")} ${error.error}`);
			return;
		}

		const data = await response.json();
		alert(`✅ ${i18next.t("invite_success")} ${ friendName }`);
		navigate('/friends');
	} catch (err) {
		console.error("Error while sending invite:", err);
		alert(`⚠️ ${i18next.t("network_error")}`);
	}
}

export async function fetchFriendInvites(): Promise<Invites[]> {
	const username = sessionStorage.getItem('username') || '';

	try {
		const response = await fetch(API_ROUTES.getInvites(username!), {
			method: "GET",
			credentials: "include",
		});

		const data = await response.json();

		if (!response.ok) {
			console.error("Error while searching invites:", data.error || data);
			return [];
		}

		return data.invites || [];
	} catch (err) {
		console.error("Network error:", err);
		return [];
	}
}

export async function acceptInvite(friend: string) {
	try {
		const response = await fetch(API_ROUTES.acceptInvite, {
			method: "PATCH",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ friend }),
		});

		const data = await response.json();

		if (!response.ok) {
			console.error("Error while accepting invite:", data.error || data);
			alert(`❌ ${i18next.t('accept_error')}` + (data.error || "Unknown error"));
			return false;
		}

		navigate('/friends');

		return true;
	} catch (err) {
		console.error("Network error while accepting invite:", err);
		return false;
	}
}

export async function declineInvite(friend: string) {
	try {
		const response = await fetch(API_ROUTES.declineInvite, {
			method: "DELETE",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ friend }),
		});

		const data = await response.json().catch(() => null);

		if (!response.ok) {
			console.error("Error while declining invite:", data?.error || data);
			alert("❌ Error while declining invite: " + (data?.error || "Unknown error"));
			return false;
		}

		return true;
	} catch (err) {
		console.error("Network error while declining invite:", err);
		return false;
	}
}

export async function fetchFriends(): Promise<Friend[]> {
	const username = sessionStorage.getItem("username") || "";

	try {
		const response = await fetch(API_ROUTES.getFriends(username), {
			method: "GET",
			credentials: "include",
		});

		const data = await response.json();

		if (!response.ok) {
			console.error("Error while searching for friends:", data.error || data);
			return [];
		}

		return data.friendships || [];
	} catch (err) {
		console.error("Network error while searching for friends:", err);
		return [];
	}
}

export async function unfriendUser(friendUsername: string) {
    try {
        const response = await fetch(API_ROUTES.unfriend, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ friend: friendUsername }),
        });

        let data;
        if (response.status === 201) {
            data = await response.text(); 
            alert(data); 
            return true;
        } else {
            data = await response.json();
            console.error("Error while removing friend:", data.error || data);
            alert(data.error || `${i18next.t('remove_friend_error')}`);
            return false;
        }

    } catch (err) {
        console.error("Network error:", err);
        alert("Network error while removing friend");
        return false;
    }
}

export async function fetchUserAvatar(username: string): Promise<string> {
	try {
		const response = await fetch(API_ROUTES.getAvatar(username), {
			method: "GET",
			credentials: "include",
		});

		if (!response.ok) {
			console.error(`Error while searching for ${username} avatar:`, response.status);
			return "/images/randomAvatar/0.jpeg";
		}

		const blob = await response.blob();
		return URL.createObjectURL(blob);
	} catch (err) {
		console.error("Network error while searching for avatar:", err);
		return "/images/randomAvatar/0.jpeg";
	}
}