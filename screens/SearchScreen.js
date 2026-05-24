import React, { useState } from 'react';

import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';
import { pesquisarConteudos } from '../services/tmdb';
import { CONTENT_TYPES, normalizeContentType } from '../constants/contentType';

import Header from '../components/Header';
import ContentCard from '../components/ContentCard';
import SearchBar from '../components/SearchBar';

export default function SearchScreen({ navigation }) {
  const [busca, setBusca] = useState(''); // Texto digitado pelo usuário
  const [resultados, setResultados] = useState([]); // Array de filmes/séries encontrados
  const [carregando, setCarregando] = useState(false); // Diferente das outras telas: começa false, pois só carrega ao pesquisar

  // Executada ao confirmar a busca no teclado (onSubmit do SearchBar)
  async function pesquisar() {
    // Ignora buscas muito curtas para evitar requisições desnecessárias
    if (busca.trim().length < 2) {
      return;
    }

    setCarregando(true);

    try {
      const resposta = await pesquisarConteudos(busca);
      setResultados(resposta);
    } catch (erro) {
      console.log('Erro na busca', erro);
    } finally {
      setCarregando(false);
    }
  }

  // Converte o media_type em tipo interno padronizado ('movie' ou 'tv')
  function abrirItem(item) {
    const tipo = normalizeContentType(item.media_type) || CONTENT_TYPES.MOVIE;
    navigation.getParent()?.getParent()?.navigate('Detalhes', { id: item.id, tipo });
  }

  return (
    <View style={styles.container}>
      <Header
        titulo="Buscar"
        subtitulo="Ache o próximo filme ou série para a sua lista."
      />

      {/* Campo de busca com botão de submit no teclado */}
      <SearchBar valor={busca} onChangeText={setBusca} onSubmit={pesquisar} />

       {/* Renderização condicional: spinner durante a busca, lista após */}
      {carregando ? (
        <ActivityIndicator color={colors.roxo} style={styles.loading} />
      ) : (
        <FlatList
          data={resultados}
          numColumns={2}
          // Chave composta com media_type para evitar colisão entre IDs de filmes e séries
          keyExtractor={(item) => `${item.media_type}-${item.id}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.lista}
           // Exibido quando resultados está vazio (antes de qualquer busca ou sem resultados)
          ListEmptyComponent={
            <Text style={styles.vazio}>Busque por título, elenco ou palavra-chave para achar algo para a sua lista.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.item}>
               {/* Usa ContentCard para ambos os tipos */}
              <ContentCard item={item} largura="100%" onPress={() => abrirItem(item)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
  },
  loading: {
    marginTop: 32,
  },
  lista: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 24,
  },
  item: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
  vazio: {
    color: colors.textoSecundario,
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 28,
    lineHeight: 22,
  },
});

/*
Caminho para chegar em Detalhes:
Tab → getParent() → Drawer → getParent() → Stack → navigate('Detalhes')
*/