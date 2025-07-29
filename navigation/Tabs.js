import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CadastroScreen from '../screens/CadastroScreen';
import EstoqueScreen from '../screens/EstoqueScreen';
import MovimentacoesScreen from '../screens/MovimentacaoScreen';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Estoque" component={EstoqueScreen} />
      <Tab.Screen name="Movimentações" component={MovimentacoesScreen} />
      <Tab.Screen name="Cadastrar" component={CadastroScreen} />
    </Tab.Navigator>
  );
}