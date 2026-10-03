# Site do ForBarber

Página de vendas do ForBarber (sistema para barbearias). Site estático: abra `index.html` ou publique a pasta no Vercel, Netlify ou GitHub Pages.

O sistema (painel, agendamento, "Criar barbearia" e "Entrar") fica em outro repositório: [okaiquemota/app.ios.android.forbarber](https://github.com/okaiquemota/app.ios.android.forbarber).

## Configurar

Edite só `assets/js/config.js`:

- `appUrl`: endereço onde o sistema está publicado. Os botões "Testar grátis", "Entrar" e "Demonstração" apontam para lá, e o exemplo de link da barbearia usa esse domínio.
- `plans`: nomes e preços. Mantenha igual ao `app/assets/js/config.js` do sistema.
- `salesWhatsapp`: número do WhatsApp de vendas.

## Identidade

Azul-marinho, vermelho do poste de barbeiro e fonte Archivo. Nada de MovCode nem das barbearias clientes.

A Archivo é uma fonte variável e fica no próprio site (`assets/vendor/archivo/`, licença OFL): títulos com a largura no máximo (125%), etiquetas estreitas (62–75%). A animação do título do topo é a própria largura da letra.

As telas em `assets/img/produto/` são capturas do sistema rodando a demonstração.

O celular da seção "Experimente" é só uma simulação em `assets/js/site.js`: serviços, preços, barbeiros e horários ocupados são dados de exemplo, nada é enviado ao sistema.
