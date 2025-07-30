import  {  useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getMovimentacoes, getProdutos } from '../services/storage';

export default function MovimentacoesScreen() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [produtosMap, setProdutosMap] = useState({});

    useFocusEffect(
    useCallback(() => {
      const carregarDados = async () => {
        const movs = await getMovimentacoes();
        const produtos = await getProdutos();

        const mapProdutos = {};
        produtos.forEach(p => {
          mapProdutos[p.id] = p.nome;
        });

        const ordenadas = movs
          .filter(m => m.data)
          .map(m => ({
            ...m,
            data: m.data.toDate ? m.data.toDate() : new Date(m.data)  // Conversão segura
          }))
          .sort((a, b) => b.data - a.data);

        setProdutosMap(mapProdutos);
        setMovimentacoes(ordenadas);
      };

      carregarDados();
    }, [])
  );

  const renderItem = ({ item }) => {
    const nomeProduto = item.produtoNome || produtosMap[item.produtoId] || 'Desconhecido';
    const dataFormatada = item.data.toLocaleString('pt-BR');

    return (
      <View style={styles.item}>
        <Text style={styles.produto}>{nomeProduto}</Text>
        <Text style={styles.tipo}>{item.tipo.toUpperCase()}</Text>
        <Text style={styles.quantidade}>Qtd: {item.quantidade}</Text>
        <Text style={styles.data}>{dataFormatada}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Movimentações</Text>
      <FlatList
        data={movimentacoes}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhuma movimentação registrada.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  item: {
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  produto: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipo: {
    fontSize: 16,
    color: '#555',
  },
  quantidade: {
    fontSize: 16,
    marginTop: 4,
  },
  data: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  }
});
