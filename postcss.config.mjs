/** @type {import('postcss').Config} */
const config = {
  plugins: {
    // Tailwind CSS v4 utilise @tailwindcss/postcss (plus besoin de tailwindcss séparé)
    "@tailwindcss/postcss": {},
  },
}

export default config
