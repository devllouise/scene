import React, { useEffect, useState } from 'react';

import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BANNER_URL, IMG_URL, buscarDetalhes } from '../services/tmdb';
import { colors } from '../constants/colors';
import { CONTENT_TYPES, contentTypeLabel, normalizeContentType } from '../constants/contentType';
import { buscarItem, inserirItem, removerMarcacao } from '../database/db';

import CustomButton from '../components/CustomButton';

// Recebe id e tipo via route.params, passados pela tela de origem ao navegar
export default function DetailsScreen({ route, navigation }) {
  const { id, tipo } = route.params;
  const tipoNormalizado = normalizeContentType(tipo) || CONTENT_TYPES.MOVIE;


  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [avaliacao, setAvaliacao] = useState('0.0');
  const [marcacoes, setMarcacoes] = useState({
    favorito: false,
    lista: false,
    assistido: false,
  });

  // Busca os detalhes completos do título ao montar a tela
  // Roda novamente se id ou tipo mudarem (navegação para outro item)
  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await buscarDetalhes(id, tipoNormalizado);
        setDetalhes(resposta);
        // Inicializa a avaliação com a nota da API, formatada com 1 casa decimal
        setAvaliacao(Number(resposta.vote_average || 0).toFixed(1));

        const idLocal = tipoNormalizado === CONTENT_TYPES.TV ? Number(resposta.id) + 1000000000 : Number(resposta.id);
        const itemSalvo = await buscarItem(idLocal);
        setMarcacoes({
          favorito: itemSalvo?.favorito === 1 || itemSalvo?.status === 'favorito',
          lista: itemSalvo?.lista === 1 || itemSalvo?.status === 'lista',
          assistido: itemSalvo?.assistido === 1 || itemSalvo?.status === 'assistido',
        });
      } catch (erro) {
        console.log('Erro ao carregar detalhes', erro);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, [id, tipo, tipoNormalizado]);

  // Monta o objeto no formato esperado pelo banco de dados local
  function montarItem(marcacao) {
    // Séries recebem um offset de 1 bilhão para evitar colisão de ID com filmes
    // (a API do TMDB pode ter um filme e uma série com o mesmo id numérico)
    const idLocal = tipoNormalizado === CONTENT_TYPES.TV ? Number(detalhes.id) + 1000000000 : Number(detalhes.id);

    return {
      id: idLocal,
      titulo: detalhes.title || detalhes.name, // Filmes usam 'title', séries usam 'name'
      tipo: tipoNormalizado,
      imagem: detalhes.poster_path ? `${IMG_URL}${detalhes.poster_path}` : '',
      nota: avaliacao,
      ...marcacoes,
      lista: marcacao === 'lista' ? true : marcacao === 'assistido' ? false : marcacoes.lista,
      assistido: marcacao === 'assistido' ? true : marcacao === 'lista' ? false : marcacoes.assistido,
      [marcacao]: true,
      status: marcacao,
    };
  }

  // Incrementa ou decrementa a avaliação em 0.5, respeitando o intervalo [0, 10]
  function mudarAvaliacao(valor) {
    const novaNota = Number(avaliacao) + valor;

    if (novaNota >= 0 && novaNota <= 10) {
      setAvaliacao(novaNota.toFixed(1));
    }
  }

  async function alternarMarcacao(marcacao) {
    if (marcacoes[marcacao]) {
      await removerMarcacao(montarItem(marcacao).id, marcacao);
      setMarcacoes((atual) => ({ ...atual, [marcacao]: false }));
      return;
    }

    await inserirItem(montarItem(marcacao));
    setMarcacoes((atual) =>
      marcacao === 'lista'
        ? { ...atual, lista: true, assistido: false }
        : marcacao === 'assistido'
          ? { ...atual, assistido: true, lista: false }
          : { ...atual, [marcacao]: true }
    );
  }

   // Estado de carregamento
  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.roxo} size="large" />
      </View>
    );
  }

  // Estado de erro: API retornou vazio e o fallback também falhou
  if (!detalhes) {
    return (
      <View style={styles.loading}>
        <Text style={styles.texto}>Não consegui carregar esse título agora. Tente de novo em instantes.</Text>
      </View>
    );
  }

  // Prepara as variáveis derivadas dos dados recebidos
  const titulo = detalhes.title || detalhes.name;
  const banner = detalhes.backdrop_path ? `${BANNER_URL}${detalhes.backdrop_path}` : null;
  const poster = detalhes.poster_path ? `${IMG_URL}${detalhes.poster_path}` : null;
  const generos = detalhes.genres ? detalhes.genres.map((item) => item.name).join('  •  ') : '';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Área do banner ─────────────────────────────────────────────────── */}
      <View style={styles.bannerArea}>
        {banner ? <Image source={{ uri: banner }} style={styles.banner} /> : null}

        <View style={styles.sombra} />

        {/* Botão de voltar flutuante sobre o banner */}
        <Pressable onPress={() => navigation.goBack()} style={styles.voltar}>
          <Ionicons name="chevron-back" size={24} color={colors.texto} />
        </Pressable>
      </View>

       {/* ── Conteúdo principal ─────────────────────────────────────────────── */}
      <View style={styles.conteudo}>

        {/* Poster + informações básicas centralizados */}
        <View style={styles.topo}>
          {poster ? <Image source={{ uri: poster }} style={styles.poster} /> : null}

          <View style={styles.info}>
            <Text style={styles.tipo}>{contentTypeLabel(tipoNormalizado)}</Text>
            <Text style={styles.titulo}>{titulo}</Text>
            <Text style={styles.nota}>★ {Number(detalhes.vote_average || 0).toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.generos}>{generos}</Text>
        <Text style={styles.sinopse}>
          {detalhes.overview || 'A sinopse deste título ainda não veio completa do TMDB.'}
        </Text>

         {/* ── Avaliação pessoal ───────────────────────────────────────────── */}
        <View style={styles.avaliacao}>
          <Text style={styles.avaliacaoTexto}>Sua nota para este título</Text>
          <View style={styles.notaLinha}>
            <CustomButton texto="-" tipo="secundario" onPress={() => mudarAvaliacao(-0.5)} />
            <Text style={styles.minhaNota}>{avaliacao}</Text>
            <CustomButton texto="+" tipo="secundario" onPress={() => mudarAvaliacao(0.5)} />
          </View>
        </View>

         {/* ── Ações de salvamento ─────────────────────────────────────────── */}
        <View style={styles.botoes}>
          <CustomButton
            texto={marcacoes.favorito ? 'Favoritado' : 'Favoritar'}
            tipo={marcacoes.favorito ? 'primario' : 'secundario'}
            onPress={() => alternarMarcacao('favorito')}
            icon={
              <Ionicons
                name={marcacoes.favorito ? 'heart' : 'heart-outline'}
                size={18}
                color={colors.texto}
              />
            }
          />

          <CustomButton
            texto={marcacoes.lista ? 'Na Lista' : 'Minha Lista'}
            tipo={marcacoes.lista ? 'primario' : 'secundario'}
            onPress={() => alternarMarcacao('lista')}
            icon={
              <Ionicons
                name={marcacoes.lista ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={colors.texto}
              />
            }
          />
          
          <CustomButton
            texto={marcacoes.assistido ? 'Já visto' : 'Marcar como visto'}
            tipo={marcacoes.assistido ? 'primario' : 'secundario'}
            onPress={() => alternarMarcacao('assistido')}
            icon={
              <Ionicons
                name={marcacoes.assistido ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={18}
                color={colors.texto}
              />
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerArea: {
    height: 310,
    backgroundColor: colors.card,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  sombra: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 170,
    backgroundColor: colors.overlay,
  },
  voltar: {
    position: 'absolute',
    top: 46,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conteudo: {
    padding: 20,
    marginTop: -96,
  },
  topo: {
    alignItems: 'center',
  },
  poster: {
    width: 148,
    height: 222,
    borderRadius: 18,
    backgroundColor: colors.borda,
    borderWidth: 1,
    borderColor: colors.bordaForte,
  },
  info: {
    alignItems: 'center',
    marginTop: 18,
  },
  tipo: {
    color: colors.azul,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 6,
  },
  titulo: {
    color: colors.texto,
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
  },
  nota: {
    color: colors.roxo,
    fontSize: 15,
    fontWeight: '800',
    marginTop: 8,
  },
  generos: {
    color: colors.textoSecundario,
    fontSize: 14,
    marginTop: 22,
    lineHeight: 21,
    textAlign: 'center',
  },
  sinopse: {
    color: colors.texto,
    fontSize: 15,
    lineHeight: 24,
    marginTop: 18,
  },
  avaliacao: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginTop: 22,
    borderWidth: 1,
    borderColor: colors.borda,
  },
  avaliacaoTexto: {
    color: colors.textoSecundario,
    marginBottom: 12,
    fontWeight: '700',
  },
  notaLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  minhaNota: {
    color: colors.texto,
    fontSize: 22,
    fontWeight: '900',
    minWidth: 54,
    textAlign: 'center',
  },
  botoes: {
    gap: 12,
    marginTop: 24,
    marginBottom: 34,
  },
  texto: {
    color: colors.texto,
  },
});
