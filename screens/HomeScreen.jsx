import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [data, setData] = useState([]);
  const [complejo, setComplejo] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetch('https://api.movie.com.uy/api/shows/rss/data')
      .then(res => res.json())
      .then(json => {
        setData(json.contentCinemaShows);
        const complejos = new Set();
        json.contentCinemaShows.forEach(pelicula => {
          pelicula.cinemaShows.forEach(c => complejos.add(c.cinema));
        });
        setComplejo([...complejos][0]); // Primero por defecto
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  const complejosUnicos = [...new Set(
    data.flatMap(pelicula => pelicula.cinemaShows.map(c => c.cinema))
  )];

  const peliculasEnComplejo = data.filter(pelicula =>
    pelicula.cinemaShows.some(c => c.cinema === complejo)
  );

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Picker selectedValue={complejo} onValueChange={setComplejo}>
        {complejosUnicos.map((nombre, i) => (
          <Picker.Item label={nombre} value={nombre} key={i} />
        ))}
      </Picker>

      <FlatList
        data={peliculasEnComplejo}
        keyExtractor={item => item.movie}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Detalle', { movie: item, complejo })}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <Image
                source={{ uri: item.posterURL }}
                style={{ width: 100, height: 150 }}
                resizeMode="cover"
              />
              <Text style={{ marginLeft: 10, fontSize: 16, fontWeight: 'bold' }}>{item.movie}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}