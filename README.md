# Site do ForBarber

Página de vendas do ForBarber (sistema para barbearias). Site estático: abra `index.html` ou publique a pasta no Vercel, Netlify ou GitHub Pages.

O sistema (painel, agendamento, "Criar barbearia" e "Entrar") fica em outro repositório: [okaiquemota/app.ios.android.forbarber](https://github.com/okaiquemota/app.ios.android.forbarber).

## Configurar

Edite só `assets/js/config.js`:

- `appUrl`: endereço onde o sistema está publicado. Os botões "Testar grátis", "Entrar" e "Demonstração" apontam para lá, e o exemplo de link da barbearia usa esse domínio.
- `plans`: nomes e preços. Mantenha igual ao `app/assets/js/config.js` do sistema.
- `salesWhatsapp`: número do WhatsApp de vendas.

## Identidade

Barbearia clássica de alto padrão: azul-marinho, marfim e o vermelho do poste de barbeiro num tom fechado (bordô). Nada de MovCode nem das barbearias clientes.

Títulos em Cormorant Garamond, texto e etiquetas em Archivo. As duas fontes ficam no próprio site (`assets/vendor/cormorant/` e `assets/vendor/archivo/`, licença OFL). Pouco movimento: só um fade curto ao rolar.

As telas em `assets/img/produto/` são capturas do sistema rodando a demonstração.
