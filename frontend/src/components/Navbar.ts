import { API_ROUTES } from "../config";
import { navigate } from "../router";
import i18next from "i18next";

export function Navbar(): HTMLElement {
	const nav = document.createElement('nav');
	nav.className =
		'bg-[#174B7A] text-white font-orbitron font-semibold px-8 py-4 flex justify-between items-center';

	// 🔹 Links principais
	const ul = document.createElement('ul');
	ul.className = 'flex gap-6';

	const links = ['Games', 'Friends', 'Statistics', 'Settings'];

	links.forEach((text) => {
		const li = document.createElement('li');
		const a = document.createElement('a');
		a.href = `/${text.toLowerCase()}`;
		a.textContent = i18next.t(text.toLowerCase()); 
		a.className = 'inline-block transform transition-transform hover:scale-105';

		a.addEventListener("click", (e) => {
			e.preventDefault();
			navigate(`/${text.toLowerCase()}`);
		});

		li.appendChild(a);
		ul.appendChild(li);
	});

	// 🔹 Logout
	const logout = document.createElement('a');
	logout.textContent = i18next.t("logout"); 
	logout.href = "#";
	logout.className = 'inline-block transform transition-transform hover:scale-105';
	logout.addEventListener("click", (e) => {
		e.preventDefault();
		navigate('./logout');
	});

	// 🔹 Seletor de idiomas
	const langSelect = document.createElement("select");
	langSelect.className =
		'ml-4 bg-[#0F3558] text-white px-2 py-1 rounded cursor-pointer';

	const langs = [
		{ code: "en", label: "EN" },
		{ code: "pt", label: "PT" },
		{ code: "fr", label: "FR" },
	];

	langs.forEach(({ code, label }) => {
		const option = document.createElement("option");
		option.value = code;
		option.textContent = label;
		if (code === i18next.language) option.selected = true;
		langSelect.appendChild(option);
	});

	langSelect.addEventListener("change", async (e) => {
		const lang = (e.target as HTMLSelectElement).value;

		try {
			const res = await fetch(API_ROUTES.uploadLang, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ newLanguage: lang.toUpperCase() }),
			});

			if (!res.ok) {
				const err = await res.json();
				alert(`⚠️ ${err.message}`);
				return;
			}

			const data = await res.json();
			console.log(data.message); // Language successfully updated

			i18next.changeLanguage(lang, () => {
				localStorage.setItem("lang", lang);
				navigate(window.location.pathname);
			});

		} catch (error) {
			console.error("Erro ao atualizar idioma:", error);
			alert("Erro ao atualizar idioma");
		}
	});

	// 🔹 Agrupar Logout + Seletor
	const rightContainer = document.createElement('div');
	rightContainer.className = "flex items-center gap-4";
	rightContainer.appendChild(langSelect);
	rightContainer.appendChild(logout);

	nav.appendChild(ul);
	nav.appendChild(rightContainer);

	return nav;
}
