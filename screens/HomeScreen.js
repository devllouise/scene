import React, { useEffect, useState } from 'react';

import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { buscarFilmesPopulares, buscarSeriesPopulares } from '../services/tmdb';
import { colors } from '../constants/colors';
import { appLogo } from '../constants/branding';
import { CONTENT_TYPES } from '../constants/contentType';

import ContentCard from '../components/ContentCard';

// Componente reutilizável que renderiza uma seção horizontal de cards
// Recebe: título da seção, array de dados, tipo ('movie' ou 'tv') e a navegação
function Secao({ titulo, data, tipo, navigation }) {
  function abrirDetalhes(item) {
    navigation.getParent()?.getParent()?.navigate('Detalhes', { // getParent() sobe do Tab para o Drawer, e mais um getParent() sobe para o Stack
      id: item.id,
      tipo,
    });
  }

  return (
    <View style={styles.secao}>
      <Text style={styles.tituloSecao}>{titulo}</Text>

      {/* Lista horizontal sem scrollbar visível */}
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => `${tipo}-${item.id}`}
        contentContainerStyle={styles.lista} // Chave única: evita conflito entre filmes e séries com mesmo ID
        renderItem={({ item }) => {
          return (
            <ContentCard
              item={item}
              largura={154}
              onPress={() => abrirDetalhes(item)}
            />
          );
        }}
      />
    </View>
  );
}

export default function HomeScreen({ navigation, nomeUsuario }) {
  const [filmes, setFilmes] = useState([]);
  const [series, setSeries] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Busca filmes e séries populares ao montar a tela
  useEffect(() => {
    async function carregar() {
      try {
        const filmesApi = await buscarFilmesPopulares();
        const seriesApi = await buscarSeriesPopulares();
        setFilmes(filmesApi);
        setSeries(seriesApi);
      } catch (erro) {
        console.log('Erro ao carregar home', erro);
      } finally {
        // Encerra o loading independente de sucesso ou falha
        setCarregando(false);
      }
    }

    carregar();
  }, []); // [] = executa só uma vez, na montagem da tela

  // Exibe um spinner enquanto os dados estão sendo carregados
  if (carregando) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.roxo} size="large" />
        <Text style={styles.loadingTexto}>Preparando seu universo...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Círculo decorativo de brilho roxo no canto superior direito */}
      <View style={styles.glow} />
      <View style={styles.glowAzul} />
      <View style={styles.estrelaPequena1} />
      <View style={styles.estrelaPequena2} />
      <View style={styles.estrelaPequena3} />

      {/* Cabeçalho com logo e ações rápidas */}
      <View style={styles.header}>
        <Image source={appLogo} style={styles.logo} resizeMode="contain" />

        <View style={styles.headerAcoes}>
          {/* Botão de busca — navega direto para a aba Buscar */}
          <Pressable onPress={() => navigation.navigate('Buscar')} style={styles.iconeBotao}>
            <Ionicons name="search" size={20} color={colors.texto} />
          </Pressable>
          {/* Avatar com inicial do nome — navega para o perfil oculto no drawer */}
          <Pressable onPress={() => navigation.getParent()?.navigate('PerfilDrawer')} style={styles.avatar}>
            <Text style={styles.avatarTexto}>{(nomeUsuario || 'Usuário').charAt(0).toUpperCase()}</Text>
          </Pressable>
        </View>
      </View>

      {/* Bloco hero: saudação personalizada e descrição do app */}
      <View style={styles.hero}>
        <Text style={styles.pergunta}>O que vamos assistir hoje?</Text>
        <Text style={styles.descricao}>
          Explore filmes e séries em um catálogo simples, organizado e com a sua cara.
        </Text>
      </View>

      {/* Seções horizontais — usam slices para limitar a quantidade de cards */}
      <Secao titulo="Filmes em alta" data={filmes.slice(0, 10)} tipo={CONTENT_TYPES.MOVIE} navigation={navigation} />
      <Secao titulo="Séries populares" data={series.slice(0, 10)} tipo={CONTENT_TYPES.TV} navigation={navigation} />

      {/* Exploração adicional sem prometer personalização ou histórico */}
      <Secao titulo="Mais filmes para explorar" data={filmes.slice(10, 20)} tipo={CONTENT_TYPES.MOVIE} navigation={navigation} />
      <Secao titulo="Mais séries para explorar" data={series.slice(10, 20)} tipo={CONTENT_TYPES.TV} navigation={navigation} />
      
        {/* Espaço extra no fim para não ficar atrás da TabBar flutuante */}
      <View style={styles.espaco} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
  },

  // Círculo de brilho decorativo no canto superior direito
  glow: {
    position: 'absolute',
    top: 68,
    right: -70,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.roxo,
    opacity: 0.13,
  },
  glowAzul: {
    position: 'absolute',
    top: 420,
    left: -80,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.azul,
    opacity: 0.08,
  },
  estrelaPequena1: {
    position: 'absolute',
    top: 102,
    left: 42,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.texto,
    opacity: 0.24,
  },
  estrelaPequena2: {
    position: 'absolute',
    top: 174,
    right: 52,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.texto,
    opacity: 0.28,
  },
  estrelaPequena3: {
    position: 'absolute',
    top: 362,
    right: 110,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.texto,
    opacity: 0.2,
  },

   // Tela de loading centralizada
  loading: {
    flex: 1,
    backgroundColor: colors.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingTexto: {
    color: colors.textoSecundario,
    marginTop: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 124,
    height: 36,
  },
  headerAcoes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // Botão circular para ícones do header
  iconeBotao: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borda,
  },

  // Avatar circular com inicial do nome do usuário
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.roxo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTexto: {
    color: colors.texto,
    fontWeight: '900',
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  pergunta: {
    color: colors.texto,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
  },
  descricao: {
    color: colors.textoSecundario,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  secao: {
    marginTop: 18,
  },
  tituloSecao: {
    color: colors.texto,
    fontSize: 20,
    fontWeight: '800',
    marginLeft: 20,
    marginBottom: 12,
  },
  lista: {
    paddingLeft: 20,
    paddingRight: 6,
  },

  // Altura equivalente à TabBar flutuante para o conteúdo não ficar escondido
  espaco: {
    height: 106,
  },
});
