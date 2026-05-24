import React, { useEffect, useState } from 'react';

import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { colors } from '../constants/colors';
import { buscarSeriesPopulares } from '../services/tmdb';
import { CONTENT_TYPES } from '../constants/contentType';

import Header from '../components/Header';
import ContentCard from '../components/ContentCard';

export default function SeriesScreen({ navigation }) {
  const [series, setSeries] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca as séries populares ao montar a tela
  useEffect(() => {
    async function carregar() {
      try {
        const resposta = await buscarSeriesPopulares();
        setSeries(resposta);
      } catch (erro) {
        console.log('Erro ao carregar séries', erro);
      } finally {
        setCarregando(false);
      }
    }

    carregar();
  }, []);

  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.roxo} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        titulo="Séries"
        subtitulo="Séries para maratonar no seu ritmo e deixar na lista do Scene."
      />

    {/* Grade de séries em 2 colunas — estrutura idêntica à MoviesScreen */}
      <FlatList
        data={series}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.lista}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <ContentCard
              item={item}
              largura="100%"
              // Navega para Detalhes com tipo interno padronizado ('tv')
              onPress={() => navigation.getParent()?.getParent()?.navigate('Detalhes', { id: item.id, tipo: CONTENT_TYPES.TV })}
            />
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
    paddingBottom: 24,
  },
  item: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 16,
  },
});

/*
Fluxo da navegação para Detalhes:
1) A usuária está em uma aba (Tabs)
2) A aba está dentro do Drawer
3) O Drawer está dentro do Stack principal
4) Por isso usamos getParent() duas vezes para chegar ao Stack e chamar navigate('Detalhes')
*/