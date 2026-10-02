# Site do ForBarber

Página de vendas do ForBarber (sistema para barbearias). Site estático: abra `index.html` ou publique a pasta no Vercel, Netlify ou GitHub Pages.

O sistema (painel, agendamento, "Criar barbearia" e "Entrar") fica em outro repositório: [movcodebr/Barbearia](https://github.com/movcodebr/Barbearia).

## Configurar

Edite só `assets/js/config.js`:

- `appUrl`: endereço onde o sistema está publicado. Os botões "Testar grátis", "Entrar" e "Demonstração" apontam para lá, e o exemplo de link da barbearia usa esse domínio.
- `plans`: nomes e preços. Mantenha igual ao `app/assets/js/config.js` do sistema.
- `salesWhatsapp`: número do WhatsApp de vendas.

## Identidade

Azul-marinho, vermelho do poste de barbeiro e fonte Archivo. Nada de MovCode nem das barbearias clientes.

As telas em `assets/img/produto/` são capturas do sistema rodando a demonstração.
