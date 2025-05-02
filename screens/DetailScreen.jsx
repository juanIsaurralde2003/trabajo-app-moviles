import React from 'react';
import { View, Text, Image, ScrollView, Linking, Button } from 'react-native';

export default function DetailScreen({ route }) {
  const { movie, complejo } = route.params;

  // Encontrar los shows para el complejo actual
  const cine = movie.cinemaShows.find(c => c.cinema === complejo);

  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      <Image source={{ uri: movie.posterURL }} style={{ width: '100%', height: 300 }} />
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>{movie.movie}</Text>
      <Text style={{ marginBottom: 10 }}>{movie.description}</Text>

      <Text style={{ fontWeight: 'bold', marginTop: 10 }}>Horarios en {complejo}:</Text>
      {cine && cine.shows.map((h, i) => (
        <Text key={i}>{h.timeToDisplay} - {h.formatLang} - {h.screenName}</Text>
      ))}
      {!cine && <Text>No hay funciones para este complejo.</Text>}

      {movie.trailerURL && (
        <Button title="Ver trailer" onPress={() => Linking.openURL(movie.trailerURL)} />
      )}
    </ScrollView>
  );
}
