import { useEffect, useState } from 'react'
import { Alert, Text, View } from 'react-native'
import MapView, { Callout, Marker } from 'react-native-maps'
import * as Location from 'expo-location'
import { router } from 'expo-router'

import { Categories, CategoryProps } from '@/components/categories'

import { api } from '@/services/api'
import { PlaceProps } from '@/components/place'
import { Places } from '@/components/places'
import { Loading } from '@/components/loading'

import locationIconMarker from '@/assets/location.png'
import pinMarker from '@/assets/pin.png'

import { fontFamily, colors } from '@/styles/theme'

type MarketProps = PlaceProps & {
  latitude: number
  longitude: number
}

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494
}

export default function Home() {
  const [categories, setCategories] = useState<CategoryProps>([])
  const [markets, setMarkets] = useState<MarketProps[]>([])
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  async function fetchCategories() {
    setLoading(true)

    try {
      const { data } = await api.get('/categories')

      setCategories(data)
      setCategory(data[0].id)
    } catch (error) {
      console.log(error)
      Alert.alert('Oops!', 'Não foi possível carregar as categorias. :(')
    } finally {
      setLoading(false)
    }
  }

  async function fetchMarkets() {
    try {
      if (!category) return

      const { data } = await api.get(`/markets/category/${category}`)

      setMarkets(data)
    } catch (error) {
      console.log(error)
      Alert.alert('Oops!', 'Não foi possível carregar os locais. :(')
    }
  }

  async function getCurrentLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        return setErrorMsg('Permission to access location was denied')
      }

      let location = await Location.getCurrentPositionAsync({})
      console.log('LOCATION: ', location)
      setLocation(location)
    } catch (error) {
      console.log(error)
      Alert.alert('Oops...', 'Não foi possível obter sua localização atual.')
    }
  }

  //useEffect(() => {})

  useEffect(() => {
    //getCurrentLocation()
    fetchCategories()
  }, [])

  useEffect(() => {
    fetchMarkets()
  }, [category])

  return loading ? <Loading /> : (
    <View style={{ flex: 1, backgroundColor: '#cecece' }}>
      <Categories data={categories} selected={category} onSelect={setCategory}/>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}>
          <Marker
            title='Você está aqui'
            description=''
            identifier='current'
            image={locationIconMarker}
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude
            }}/>
            {markets.map((item) => (
              <Marker
                key={item.id}
                title={item.name}
                //description={item.description}
                //identifier={item.id}
                image={pinMarker}
                coordinate={{
                  latitude: item.latitude,
                  longitude: item.longitude
                }}
                onPress={() => router.navigate(`/market/${item.id}`)}>
                  <Callout
                    onPress={() => router.navigate(`/market/${item.id}`)}>
                    <View>
                      <Text
                        style={{
                          fontSize: 14,
                          color: colors.gray[600],
                          fontFamily: fontFamily.medium
                        }}>{item.name}</Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.gray[600],
                          fontFamily: fontFamily.regular
                        }}>{item.address}</Text>
                    </View>
                  </Callout>
                </Marker>
            ))}
        </MapView>
      <Places data={markets}/>
    </View>
  )
}
