import axios from 'axios';
import { CONTENT_TYPES, normalizeContentType } from '../constants/contentType';

// Configure no Expo como EXPO_PUBLIC_TMDB_API_KEY
const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY || '';

// URL base de todas as requisições à API
const BASE_URL = 'https://api.themoviedb.org/3';

// URLs para montar o caminho completo das imagens
// w500 = poster em resolução padrão | w780 = banner/backdrop em resolução maior
export const IMG_URL = 'https://image.tmdb.org/t/p/w500';
export const BANNER_URL = 'https://image.tmdb.org/t/p/w780';

// Instância configurada do axios — evita repetir baseURL e params em cada chamada
// Todo request já inclui automaticamente a api_key e o idioma pt-BR
const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR',
  },
});

// ─── DADOS DE FALLBACK ────────────────────────────────────────────────────────
// Usados quando a API falha (sem internet, limite de requests, etc.). É um plano B — o que o código usa quando a opção principal falha.
// Garantem que o app não quebre e ainda mostre algum conteúdo ao usuário
const filmesDemo = [
  {
    id: 550,
    title: 'Clube da Luta',
    poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    vote_average: 8.4,
    overview: 'Um homem comum encontra uma forma inesperada de escapar da rotina.',
    genres: [{ name: 'Drama' }],
  },
  {
    id: 603,
    title: 'Matrix',
    poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    backdrop_path: '/icmmSD4vTTDKOq2vvdulafOGw93.jpg',
    vote_average: 8.2,
    overview: 'Um programador descobre que a realidade pode ser bem diferente do que parece.',
    genres: [{ name: 'Ficção científica' }, { name: 'Ação' }],
  },
  {
    id: 155,
    title: 'Batman: O Cavaleiro das Trevas',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    vote_average: 8.5,
    overview: 'Batman enfrenta um criminoso que transforma Gotham em um grande teste moral.',
    genres: [{ name: 'Ação' }, { name: 'Crime' }],
  },
];

const seriesDemo = [
  {
    id: 1399,
    name: 'Game of Thrones',
    poster_path: '/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg',
    backdrop_path: '/2OMB0ynKlyIenMJWI2Dy9IWT4c.jpg',
    vote_average: 8.4,
    overview: 'Famílias poderosas disputam poder em um mundo cheio de alianças e conflitos.',
    genres: [{ name: 'Drama' }, { name: 'Fantasia' }],
  },
  {
    id: 66732,
    name: 'Stranger Things',
    poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    vote_average: 8.6,
    overview: 'Um grupo de amigos encara mistérios sobrenaturais em uma pequena cidade.',
    genres: [{ name: 'Drama' }, { name: 'Mistério' }],
  },
  {
    id: 94997,
    name: 'House of the Dragon',
    poster_path: '/z2yahl2uefxDCl0nogcRBstwruJ.jpg',
    backdrop_path: '/etj8E2o0Bud0HkONVQPjyCkIvpv.jpg',
    vote_average: 8.3,
    overview: 'A história da Casa Targaryen antes dos eventos mais conhecidos de Westeros.',
    genres: [{ name: 'Drama' }, { name: 'Fantasia' }],
  },
];

// ─── FUNÇÕES DE ACESSO À API ──────────────────────────────────────────────────

// Busca os filmes mais populares do momento na API do TMDB
// Em caso de falha, retorna os filmes de demonstração
export async function buscarFilmesPopulares() {
  try {
    const resposta = await api.get('/movie/popular');
    return resposta.data.results;
  } catch (erro) {
    return filmesDemo;
  }
}

// Busca as séries mais populares do momento na API do TMDB
// Em caso de falha, retorna as séries de demonstração
export async function buscarSeriesPopulares() {
  try {
    const resposta = await api.get('/tv/popular');
    return resposta.data.results;
  } catch (erro) {
    return seriesDemo;
  }
}

// Pesquisa filmes e séries pelo texto digitado pelo usuário
export async function pesquisarConteudos(texto) {
  try {
       // /search/multi pesquisa em filmes, séries e pessoas ao mesmo tempo
    const resposta = await api.get('/search/multi', {
      params: {
        query: texto,
        include_adult: false, // Exclui conteúdo adulto dos resultados
      },
    });

    // Filtra apenas filmes e séries, descartando resultados do tipo 'person'
    return resposta.data.results.filter(
      (item) => item.media_type === 'movie' || item.media_type === 'tv'
    );
  } catch (erro) {
     // Fallback: busca local nos dados de demonstração
    const termo = texto.toLowerCase();

     // Combina filmes e séries demo, adiciona media_type para padronizar o formato
    return [
      ...filmesDemo.map((item) => ({ ...item, media_type: 'movie' })),
      ...seriesDemo.map((item) => ({ ...item, media_type: 'tv' })),
      // Filmes usam 'title', séries usam 'name' — verifica os dois
    ].filter((item) => (item.title || item.name).toLowerCase().includes(termo));
  }
}

// Busca os detalhes completos de um filme ou série pelo ID
export async function buscarDetalhes(id, tipo) {
   // Tipo interno padronizado: 'movie' ou 'tv'
  const rota = normalizeContentType(tipo) || CONTENT_TYPES.MOVIE;
  try {
    const resposta = await api.get(`/${rota}/${id}`);
    return resposta.data; // Objeto completo com todos os detalhes do título
  } catch (erro) {
    // Fallback: procura nos dados demo pelo ID; se não achar, retorna o primeiro
    const base = rota === 'tv' ? seriesDemo : filmesDemo;
    return base.find((item) => item.id === id) || base[0];
  }
}
