/* ==========================================================================
   CONFIGURAÇÃO DO SITE DO FORBARBER
   appUrl: endereço onde o sistema está publicado (repositório movcodebr/Barbearia).
   É de lá que saem "Testar grátis", "Entrar", a demonstração e o link
   das barbearias (appUrl + nome-da-barbearia).
   Planos: mantenha igual ao app/assets/js/config.js do sistema.
   ========================================================================== */
window.FORBARBER_SITE = {
  appUrl: 'https://movcodebr.github.io/Barbearia/',
  plans: [
    { id: 'solo', name: 'Solo', price: 49.9, barbers: 1 },
    { id: 'equipe', name: 'Equipe', price: 89.9, barbers: 4 },
    { id: 'premium', name: 'Premium', price: 149.9, barbers: 99 },
  ],
  salesWhatsapp: '5516982157266',
};
