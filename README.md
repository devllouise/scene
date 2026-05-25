# Scene

Scene é um aplicativo acadêmico feito em React Native para organizar filmes e séries em um único lugar. Foi desenvolvido por: Aimee Alves, Alice Gandra e Maíra Silvério.

## Objetivo

O projeto resolve uma dor simples: muita gente usa apps diferentes para descobrir o que assistir, salvar para depois e marcar o que já viu.

Com o Scene, a proposta é centralizar isso em um único fluxo:

- explorar filmes e séries
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
- Componentes reutilizáveis
- StyleSheet
- SQLite (expo-sqlite)
- TMDB API (axios)

## Estrutura principal

- App.js: fluxo inicial e navigator principal
- routes/: Drawer e Tabs
- screens/: telas do app
- components/: componentes reutilizáveis
- services/tmdb.js: integração com API
- database/db.js: persistência local com SQLite
- constants/: cores e branding

## Como rodar

1. Instale as dependências:

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
- Home com seções de filmes e séries
- Busca por títulos
- Tela de detalhes com sinopse e avaliação
- Favoritos
- Minha Lista (lista)
- Assistidos (arquivo)
- Perfil com estatísticas locais

## Observacoes academicas

- O projeto foi pensado para demonstrar os conteúdos da disciplina sem depender de backend próprio.
- Os dados puúblicos vem da TMDB e os dados pessoais da usuária ficam no SQLite local.
