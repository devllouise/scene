import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../constants/colors';

export default function CustomButton({ texto, onPress, tipo = 'primario', icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.botao,
        tipo === 'secundario' && styles.secundario,
        pressed && styles.pressionado,
      ]}
    >
      <View style={styles.conteudo}>
        {React.isValidElement(icon) ? icon : null}
        <Text style={[styles.texto, tipo === 'secundario' && styles.textoSecundario]}>
          {texto}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: colors.roxo,
    borderRadius: 18,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: colors.roxo,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  secundario: {
    backgroundColor: colors.fundoSecundario,
    borderWidth: 1,
    borderColor: colors.borda,
    shadowOpacity: 0,
    elevation: 0,
  },
  conteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pressionado: {
    opacity: 0.75,
  },
  texto: {
    color: colors.texto,
    fontSize: 15,
    fontWeight: '700',
  },
  textoSecundario: {
    color: colors.texto,
  },
});
