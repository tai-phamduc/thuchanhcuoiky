import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBikes } from '../app/bikeSlice'
import { View, Text, Image, FlatList, StyleSheet } from 'react-native'

export default function HomeScreen() {
  const dispatch = useDispatch()
  const { items: bikes, loading, error } = useSelector((state) => state.bikes)

  useEffect(() => {
    dispatch(fetchBikes())
  }, [dispatch])

  if (loading) {
    return <Text>Loading...</Text>
  }

  if (error) {
    return <Text>Error: {error}</Text>
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageLink }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>
  )

  return (
    <FlatList
      data={bikes}
      renderItem={renderItem}
      keyExtractor={(item) => item._id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  card: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#888',
  },
})
