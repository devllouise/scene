import React, { useEffect, useState } from 'react';

import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';
import { buscarFilmesPopulares } from '../services/tmdb';
import { CONTENT_TYPES } from '../constants/contentType';

import Header from '../components/Header';
import ContentCard from '../components/ContentCard';

export default function MoviesScreen({ navigation }) {
  const [filmes, setFilmes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca os filmes populares ao montar a tela
  useEffect(() => {
    async function carregarConteudos() {
      try {
        const filmesApi = await buscarFilmesPopulares();
        setFilmes(filmesApi);
      } catch (erro) {
        console.log('Erro ao buscar filmes', erro);
      } finally {
        setCarregando(false); // Encerra o loading em qualquer caso
      }
    }

    carregarConteudos();
  }, []); // [] = executa só uma vez, na montagem

  // Sobe dois níveis de navegação (Tab → Drawer → Stack) para chegar na tela de Detalhes
  function abrirDetalhes(item) {
    navigation.getParent()?.getParent()?.navigate('Detalhes', {
      id: item.id,
      tipo: CONTENT_TYPES.MOVIE,
    });
  }

  // Exibe spinner centralizado enquanto a API responde
  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.roxo} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho reutilizável com título e subtítulo da tela */}
      <Header titulo="Filmes" subtitulo="Filmes para entrar na sua lista, marcar depois e revisitar quando quiser." />

       {/* Grade de filmes em 2 colunas */}
      <FlatList
        data={filmes}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        columnWrapperStyle={styles.linha}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ContentCard item={item} largura="100%" onPress={() => abrirDetalhes(item)} />
          </View>
        )}
      />
    </View>
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
  lista: {
    paddingHorizontal: 14,
    paddingBottom: 106,
  },
  linha: {
    justifyContent: 'space-between',
  },
  item: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
});

/*
Caminho para chegar em Detalhes:
Tab → getParent() → Drawer → getParent() → Stack → navigate('Detalhes')
*/