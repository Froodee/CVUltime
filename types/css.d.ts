// Déclaration de type pour les imports CSS dans Next.js
// Next.js gère les imports CSS côté bundler ; cette déclaration supprime l'erreur TS
declare module "*.css" {
  const styles: Record<string, string>
  export default styles
}
