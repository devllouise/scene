# Scene

Scene e um aplicativo academico feito em React Native para organizar filmes e series em um unico lugar.

## Objetivo

O projeto resolve uma dor simples: muita gente usa apps diferentes para descobrir o que assistir, salvar para depois e marcar o que ja viu.

Com o Scene, a proposta e centralizar isso em um unico fluxo:

- explorar filmes e series
- abrir detalhes
- favoritar
- colocar na lista (Minha Lista)
- marcar como assistido

## Stack utilizada

- React Native
- Expo
- React Navigation
- Drawer Navigation
- Bottom Tabs
- useState/useEffect/useFocusEffect
- Componentes reutilizaveis
- StyleSheet
- SQLite (expo-sqlite)
- TMDB API (axios)

## Estrutura principal

- App.js: fluxo inicial e navigator principal
- routes/: Drawer e Tabs
- screens/: telas do app
- components/: componentes reutilizaveis
- services/tmdb.js: integracao com API
- database/db.js: persistencia local com SQLite
- constants/: cores e branding

## Como rodar

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o projeto com Expo:

```bash
npm start
```

3. Configure a chave da TMDB no ambiente do Expo:

```bash
EXPO_PUBLIC_TMDB_API_KEY=sua_chave_aqui
```

4. Abra no celular (Expo Go) ou emulador:

- Android:

```bash
npm run android
```

- iOS:

```bash
npm run ios
```

## Funcionalidades implementadas

- Onboarding simples com nome
- Home com secoes de filmes e series
- Busca por titulos
- Tela de detalhes com sinopse e avaliacao
- Favoritos
- Minha Lista (lista)
- Assistidos (arquivo)
- Perfil com estatisticas locais

## Observacoes academicas

- O projeto foi pensado para demonstrar os conteudos da disciplina sem depender de backend proprio.
- Os dados publicos vem da TMDB e os dados pessoais da usuaria ficam no SQLite local.
