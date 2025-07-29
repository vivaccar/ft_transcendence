import './style.css'
/* import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg' */
import { setupCounter } from './counter.ts'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <h1 class="text-3xl font-bold text-blue-600 underline">
      Olá, Vite + TypeScript + Tailwind!
    </h1>
    <p>This is working</p>
  </div>
`
setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
