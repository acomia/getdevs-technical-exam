import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState('default');
  const [data, setData] = useState([]);
  const [temp, setTemp] = useState([]);
  const [upgraded, setUpgraded] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios.get('https://pokeapi.co/api/v2/pokemon/').then(res => {
      const pokeList = res.data.results;
      setTimeout(() => {
        setData(pokeList);
        setTemp(pokeList);
        setLoading(false);
      }, 2000);
    });
  }, []);

  function getAllPokemon() {
    setLoading(true);
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=25').then(res => {
      const pokeList = res.data.results;
      setTimeout(() => {
        setData(pokeList);
        setTemp(pokeList);
        setLoading(false);
      }, 2000);
    });
  }
  function handlePicker(item) {
    if (item === 'default') {
      setPicked(item);
      setData(temp);
    } else if (item === 'upgrade') {
      setPicked(item);
      let newdata = temp.map(data => {
        let newName = {name: data.name + ' Upgraded', url: data.url};
        return newName;
      });
      setUpgraded(newdata);
      setData(newdata);
    } else if (item === 'imposter') {
      setPicked(item);
      const imposter = temp.filter(pokemon => {
        return pokemon.name.substring(0) === 'A';
      });
      setData(imposter);
    } else {
      setPicked(item);
      setData(upgraded);
    }
  }

  function renderItem({item}) {
    return (
      <View style={{flex: 1, padding: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text>Name: </Text>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.name}</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={{flex: 1, padding: 10}}>
      <ScrollView
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getAllPokemon} />
        }>
        <DropDownPicker
          items={[
            {label: 'Default', value: 'default'},
            {label: 'Upgrade', value: 'upgrade'},
            {label: 'Imposter', value: 'imposter'},
            {label: 'Ultimate', value: 'ultimate'},
          ]}
          defaultValue={picked}
          containerStyle={{
            height: 40,
            marginBottom: 10,
          }}
          style={{backgroundColor: '#fff'}}
          itemStyle={{
            justifyContent: 'flex-start',
          }}
          dropDownStyle={{backgroundColor: '#fff'}}
          onChangeItem={item => handlePicker(item.value)}
        />
      </ScrollView>
      <View style={{flex: 2}}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.url}
          ListEmptyComponent={
            <View style={{flex: 1}}>
              <Text>No Data</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
