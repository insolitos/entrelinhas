# Entrelinhas

Aplicação de palavras cruzadas em português de Portugal. HTML, CSS e JavaScript nativos, sem instalação, compilação ou dependências. Todo o processamento acontece no navegador. Não há pedidos de rede, recolha de dados, fontes remotas nem APIs.

## Abrir e utilizar

Abra `index.html` num navegador moderno (Chrome, Edge, Firefox ou Safari). Funciona diretamente como ficheiro local e também em alojamento estático.

1. Cole um texto (até 30 000 caracteres) ou carregue em **Experimentar um exemplo**.
2. Ajuste os limites de comprimento, o número de respostas e a lista de palavras ignoradas, se desejar. Carregue em **Encontrar palavras**.
3. Reveja as palavras selecionadas e escreva ou ajuste as pistas. Selecione entre 2 e 24 respostas. Todas precisam de uma pista.
4. Carregue em **Criar palavras cruzadas**. As palavras que não couberam aparecem identificadas. **Outra disposição** repete a procura.
5. Selecione uma pista ou casa. Escreva uma letra por casa; a escrita avança automaticamente. Use setas para navegar, Backspace para apagar, e Espaço ou toque repetido para alternar a direção num cruzamento.
6. **Verificar respostas** assinala letras incorretas com × e corretas com ✓, além da cor. Pode revelar a palavra ativa, mostrar toda a solução ou limpar as respostas.

As respostas usam maiúsculas sem acentos: «ação» passa a «ACAO». A lista preserva a grafia original. Formas que resultam na mesma resposta normalizada são agrupadas.

## Guardar, importar e imprimir

**Guardar neste navegador** é opcional e guarda texto, opções, seleção, pistas, grelha e letras introduzidas em `localStorage`. O comportamento de armazenamento de ficheiros locais depende do navegador. Se indisponível ou cheio, a aplicação continua a funcionar. Desativar a opção ou usar **Apagar dados guardados** elimina a cópia persistida; não apaga o jogo aberto.

**Exportar JSON** guarda a geometria da grelha, palavras, grafia original, pistas e progresso. O ficheiro não inclui o texto de origem completo. **Importar passatempo** valida estrutura, dimensões, respostas, numeração, conectividade, cruzamentos e entradas antes de substituir o jogo. O limite é 250 KB. As respostas estão legíveis no JSON: não é um formato secreto de avaliação.

**Imprimir passatempo** imprime uma grelha vazia com pistas. **Imprimir solução** inclui as letras. Na janela nativa de impressão pode escolher guardar em PDF. Para grelhas maiores, ajuste escala e orientação. Nenhuma destas ações altera as respostas em jogo.

## Testes

Abra `tests.html` diretamente no navegador. Os resultados são apresentados na página, sem bibliotecas e sem servidor. Também pode executar `node tests.js` se tiver Node.js instalado (opcional, apenas para testes).

Os testes verificam normalização, extração, ocultação de todas as ocorrências, ausência de pistas inventadas, numeração partilhada, cruzamentos, contactos ilegais, conectividade, exportação/importação, dados inválidos e várias gerações reais. Não são necessários pacotes externos.

## Publicar no GitHub Pages

1. Crie um repositório GitHub e envie todos os ficheiros desta pasta para a raiz, incluindo `.nojekyll`.
2. No repositório, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Escolha a branch `main` e a pasta **/ (root)**; guarde.
5. Após a publicação terminar, abra o endereço indicado pelo GitHub Pages.

Todos os caminhos são relativos, pelo que a aplicação funciona também num subdiretório de projeto. Não é necessário configurar domínio, segredos, bases de dados nem ações de compilação. A publicação num repositório deve ser feita na conta e no repositório que escolher.

## Organização e limites

- `app.js`: núcleo `CW` (normalização, análise, pistas, colocação, numeração, validação e serialização) separado de `initApp` (interface, teclado, persistência e impressão).
- `styles.css`: interface responsiva, foco visível, estados com símbolos e versão de impressão.
- `tests.js` e `tests.html`: testes executáveis localmente.
- Máximo de 150 candidatas, 24 respostas selecionadas, 3–20 letras por resposta, 35 × 35 casas e 500 caracteres por pista.
- A seleção é uma heurística transparente: comprimento + 3 × log₂(frequência + 1). Não faz análise semântica, lematização nem distinção entre nomes e verbos. Palavras com hífen são separadas. Só são aceites letras que normalizem para A–Z.
- As pistas usam uma frase original com pelo menos três outras palavras e até 500 caracteres. Todas as ocorrências normalizadas da resposta são ocultadas. Esta regra não garante uma pista única, interessante ou inequívoca: a revisão humana é essencial. Sem contexto suficiente, a pista fica vazia.
- O gerador faz 18 tentativas, com procura ramificada e retrocesso limitado (até 110 expansões por tentativa, até três palavras alternativas e duas posições por palavra). Cede controlo ao navegador durante a procura e entre tentativas, mostra progresso e permite cancelar. A procura termina após as tentativas previstas ou cerca de seis segundos; uma operação individual pode ultrapassar ligeiramente este prazo. Prefere número de palavras, depois cruzamentos, depois o menor lado do quadrado e maior equilíbrio entre largura e altura. Continua a explorar alternativas mesmo depois de encontrar uma disposição com todas as palavras. Não garante uma solução ótima nem que todas as palavras caibam. O desempenho varia conforme o dispositivo e a seleção.
- A validação independente confirma que cada sequência horizontal ou vertical corresponde a uma resposta declarada, que as letras coincidem, que não há sobreposição na mesma direção e que todas as respostas estão ligadas.
- Texto e ficheiros são sempre tratados como dados. Conteúdo do utilizador é apresentado com `textContent` e propriedades de elementos, nunca com `innerHTML`.

A aplicação não inclui um service worker: para uso sem ligação basta guardar esta pasta e abrir `index.html`. Uma página alojada precisa de ligação no primeiro carregamento.

## Melhorias de outubro de 2026

- Grelha sempre quadrada (N × N), incluindo impressão e JSON importados. As palavras ocupam um retângulo centrado no menor quadrado que o contém; as restantes casas são bloqueadas. Não se garante uma superfície integralmente preenchida com letras ou simetria dos blocos: isso não é possível para qualquer seleção sem acrescentar respostas externas.
- Importações e sessões antigas retangulares são convertidas para quadrado, preservando as respostas preenchidas e as pistas. A validação aceita o formato retangular antigo para permitir esta migração.
- Procura com prioridade à compactação quadrada, alternativas após colocação de todas as respostas, limite de tempo e cancelamento. Cancelar conserva o passatempo anterior.
- Contagem de casas preenchidas e ajuste do tamanho das casas entre 24 e 48 píxeis; deslocamento horizontal preservado nos ecrãs pequenos.
- Opções guardadas quando são alteradas e palavras omitidas recuperadas corretamente ao restaurar uma sessão.
- Rodapé com ligação para [TIC, Educação e WEB](https://jfborges.com/).
