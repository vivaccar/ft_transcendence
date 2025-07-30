export function createLoginForm() {
  const firstPage = document.getElementById('first-page');
  firstPage?.classList.add("hidden");

	const container = document.createElement('div');
	container.className = 'max-w-sm mx-auto p-10 bg-white bg-opacity-5 rounded-lg shadow-md backdrop-blur-md flex flex-col itens-center justify-center';

	container.innerHTML = `
    <h2 class="text-2xl text-center font-silkscreen text-white mb-4">Login</h2>
    <input id="username" type="text" placeholder="Username" class="w-full p-2 border rounded mb-2" />
    <input id="password" type="password" placeholder="Password" class="w-full p-2 border rounded mb-4" />
    <button id="login-btn" class="btn !w-full">Go</button>
    <p id="message" class="mt-4 text-red-600"></p>
  `;

  container.querySelector<HTMLButtonElement>('#login-btn')!.onclick = async () => {
    const username = (container.querySelector<HTMLInputElement>('#username')!).value;
    const password = (container.querySelector<HTMLInputElement>('#password')!).value;
    const messageEl = container.querySelector<HTMLParagraphElement>('#message')!;
    
    console.log(username, password, messageEl);

    try {
      const res = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        messageEl.textContent = 'Login successful!';
        messageEl.classList.remove('text-red-600');
        messageEl.classList.add('text-green-600');
      } else {
        messageEl.textContent = 'Login failed. Check credentials.';
        messageEl.classList.add('text-red-600');
        messageEl.classList.remove('text-green-600');
      }
    } catch (err) {
      console.log(err);
      messageEl.textContent = 'Error connecting to server.';
      messageEl.classList.add('text-red-600');
      messageEl.classList.remove('text-green-600');
    }
  }

	const app = document.querySelector<HTMLDivElement>('#app')!;
  app.appendChild(container);
}