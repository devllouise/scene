import * as SQLite from 'expo-sqlite';
import { CONTENT_TYPES, normalizeContentType } from '../constants/contentType';

let db = null;

async function abrirBanco() {
  if (!db) {
    db = await SQLite.openDatabaseAsync('scene.db');
  }

  return db;
}

async function garantirColuna(banco, nome, definicao) {
  const colunas = await banco.getAllAsync('PRAGMA table_info(scene_lista);');
  const existe = colunas.some((coluna) => coluna.name === nome);

  if (!existe) {
    await banco.execAsync(`ALTER TABLE scene_lista ADD COLUMN ${nome} ${definicao};`);
  }
}

export async function criarTabela() {
  const banco = await abrirBanco();

  await banco.execAsync(`
    CREATE TABLE IF NOT EXISTS scene_lista (
      id INTEGER PRIMARY KEY NOT NULL,
      titulo TEXT,
      tipo TEXT,
      imagem TEXT,
      nota REAL,
      status TEXT,
      favorito INTEGER DEFAULT 0,
      lista INTEGER DEFAULT 0,
      assistido INTEGER DEFAULT 0
    );
  `);

  await garantirColuna(banco, 'favorito', 'INTEGER DEFAULT 0');
  await garantirColuna(banco, 'lista', 'INTEGER DEFAULT 0');
  await garantirColuna(banco, 'assistido', 'INTEGER DEFAULT 0');

  await banco.runAsync("UPDATE scene_lista SET favorito = 1 WHERE status = 'favorito';");
  await banco.runAsync("UPDATE scene_lista SET lista = 1 WHERE status = 'lista';");
  await banco.runAsync("UPDATE scene_lista SET assistido = 1 WHERE status = 'assistido';");
  await banco.runAsync("UPDATE scene_lista SET assistido = 0 WHERE status = 'lista';");
  await banco.runAsync("UPDATE scene_lista SET lista = 0 WHERE status = 'assistido';");
  await banco.runAsync("UPDATE scene_lista SET tipo = 'movie' WHERE tipo IN ('Filme', 'filme', 'movie', 'Movie');");
  await banco.runAsync("UPDATE scene_lista SET tipo = 'tv' WHERE tipo IN ('Serie', 'Série', 'serie', 'série', 'tv', 'TV');");
}

export async function buscarItem(id) {
  const banco = await abrirBanco();

  return banco.getFirstAsync('SELECT * FROM scene_lista WHERE id = ?;', [id]);
}

export async function inserirItem(item) {
  const banco = await abrirBanco();
  const atual = await buscarItem(item.id);
  const tipoNormalizado = normalizeContentType(item.tipo) || normalizeContentType(atual?.tipo) || CONTENT_TYPES.MOVIE;

  const favorito = item.favorito ?? atual?.favorito ?? (item.status === 'favorito' ? 1 : 0);
  const lista =
    item.lista ?? (item.status === 'lista' ? 1 : item.status === 'assistido' ? 0 : atual?.lista ?? 0);
  const assistido =
    item.assistido ??
    (item.status === 'assistido' ? 1 : item.status === 'lista' ? 0 : atual?.assistido ?? 0);

  await banco.runAsync(
    `INSERT OR REPLACE INTO scene_lista
    (id, titulo, tipo, imagem, nota, status, favorito, lista, assistido)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    [
      item.id,
      item.titulo,
      tipoNormalizado,
      item.imagem,
      item.nota,
      item.status || atual?.status || null,
      favorito,
      lista,
      assistido,
    ]
  );
}

export async function listarItens(status) {
  const banco = await abrirBanco();

  if (status === 'favorito') {
    return banco.getAllAsync('SELECT * FROM scene_lista WHERE favorito = 1 ORDER BY titulo;');
  }

  if (status === 'lista') {
    return banco.getAllAsync('SELECT * FROM scene_lista WHERE lista = 1 ORDER BY titulo;');
  }

  if (status === 'assistido') {
    return banco.getAllAsync('SELECT * FROM scene_lista WHERE assistido = 1 ORDER BY titulo;');
  }

  return banco.getAllAsync('SELECT * FROM scene_lista ORDER BY titulo;');
}

export async function contarItens() {
  const banco = await abrirBanco();
  const todos = await banco.getAllAsync('SELECT * FROM scene_lista;');

  return {
    salvos: todos.filter((item) => item.lista === 1).length,
    filmes: todos.filter((item) => normalizeContentType(item.tipo) === CONTENT_TYPES.MOVIE && item.assistido === 1).length,
    series: todos.filter((item) => normalizeContentType(item.tipo) === CONTENT_TYPES.TV && item.assistido === 1).length,
    favoritos: todos.filter((item) => item.favorito === 1).length,
  };
}

export async function removerMarcacao(id, status) {
  const banco = await abrirBanco();

  if (status === 'favorito') {
    await banco.runAsync('UPDATE scene_lista SET favorito = 0 WHERE id = ?;', [id]);
  }

  if (status === 'lista') {
    await banco.runAsync('UPDATE scene_lista SET lista = 0 WHERE id = ?;', [id]);
  }

  if (status === 'assistido') {
    await banco.runAsync('UPDATE scene_lista SET assistido = 0 WHERE id = ?;', [id]);
  }

  await banco.runAsync(
    'DELETE FROM scene_lista WHERE id = ? AND favorito = 0 AND lista = 0 AND assistido = 0;',
    [id]
  );
}

export async function atualizarStatus(id, status) {
  const banco = await abrirBanco();

  if (status === 'favorito') {
    await banco.runAsync('UPDATE scene_lista SET favorito = 1 WHERE id = ?;', [id]);
    return;
  }

  if (status === 'lista') {
    await banco.runAsync('UPDATE scene_lista SET lista = 1, assistido = 0 WHERE id = ?;', [id]);
    return;
  }

  if (status === 'assistido') {
    await banco.runAsync('UPDATE scene_lista SET assistido = 1, lista = 0 WHERE id = ?;', [id]);
  }
}
