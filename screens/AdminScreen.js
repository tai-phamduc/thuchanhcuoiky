import React, { useState } from 'react'
import { View, Text, TextInput, Button, Image, StyleSheet, Alert, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { fetchBikes } from '../app/bikeSlice'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'

const API_URL = 'https://67319cf77aaf2a9aff11341c.mockapi.io/bike'
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dqhbikdg0/image/upload'
const CLOUDINARY_UPLOAD_PRESET = 'bike_images'

export default function AdminScreen() {
  const dispatch = useDispatch()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState(null) // URI of the selected image

  const navigation = useNavigation()

  // Function to handle image selection
  const pickImage = async () => {
    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      alert('Permission to access media library is required!')
      return
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    })

    // Check if selection was canceled
    if (!result.canceled) {
      setImage(result.assets[0].uri) // Set selected image URI
      console.log(result.assets[0].uri) // Log URI to console
    } else {
      console.log('Image selection was canceled')
    }
  }

  // Function to upload the image to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!image) {
      Alert.alert("Error", "Please select an image first")
      return
    }

    const formData = new FormData()
    formData.append('file', { uri: image, type: 'image/jpeg', name: 'bike_image.jpg' })
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return response.data.secure_url
    } catch (error) {
      Alert.alert("Upload Error", "Failed to upload image")
      console.error(error)
      return null
    }
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !price) {
      Alert.alert("Error", "All fields are required")
      return
    }

    // Upload the image and get its URL
    const uploadedImageUrl = await uploadImageToCloudinary()
    if (!uploadedImageUrl) return

    try {
      const newBike = { name, price: parseFloat(price), imageLink: uploadedImageUrl }
      await axios.post(API_URL, newBike)
      Alert.alert("Success", "Bike added successfully")
      dispatch(fetchBikes()) // Refresh bike list
      setName('')
      setPrice('')
      setImage(null)
    } catch (error) {
      Alert.alert("Error", "Failed to add bike")
      console.error(error)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingVertical: 16 }}>
        <Text>Go back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Add New Bike</Text>
      <TextInput
        style={styles.input}
        placeholder="Bike Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>Pick an Image</Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <Button title="Add Bike" onPress={handleSubmit} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  imagePicker: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 15,
  },
  imagePickerText: {
    color: '#888',
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginBottom: 15,
    alignSelf: 'center',
  },
})
