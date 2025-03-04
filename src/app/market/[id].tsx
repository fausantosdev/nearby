import { useEffect, useState, useRef } from 'react'
import { Alert, Modal, View, StatusBar, ScrollView } from 'react-native'
import { router, useLocalSearchParams, Redirect } from 'expo-router'
import { useCameraPermissions, CameraView } from 'expo-camera'

import { Loading } from '@/components/loading'

import { Cover } from '@/components/market/cover'
import { Details, DetailsProps } from '@/components/market/details'
import { Button } from '@/components/button'

import { api } from '@/services/api'
import { Coupon } from '@/components/market/coupon'

export default function Market() {
  const [_, requestPermission] = useCameraPermissions()

  const qrLock = useRef(false)

  const { id } = useLocalSearchParams<{id: string}>()

  const [data, setData] = useState<DetailsProps>()
  const [coupon, setCoupon] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [couponIsFetching, setIsCouponIsFetching] = useState(false)
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false)

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${id}`)
      setData(data)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      Alert .alert(
        'Oops...',
        'Não foi possível carregar os dados',
        [
          {
            text: "Ok",
            onPress: () => router.back()
          }
        ]
      )
    }
  }

  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission()

      if(!granted) {
        return Alert.alert(
          'Oops...',
          'Precisamos de permissão para acessar a câmera',
          [
            {
              text: "Ok",
              onPress: () => setIsVisibleCameraModal(false)
            }
          ]
        )
      }

      setIsVisibleCameraModal(true)
      qrLock.current = false
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Oops...',
        'Não foi possível abrir a câmera',
        [
          {
            text: "Ok",
            onPress: () => setIsVisibleCameraModal(false)
          }
        ]
      )
    }
  }

  async function handleReadQRCode() {
    try {
      setIsCouponIsFetching(true)

      const { data } = await api.post(`/markets/${id}/coupon`)
      setCoupon(data.code)

      Alert.alert('Cupon', data.coupon)
      setCoupon(data.coupon)
    } catch (error) {
      console.log(error)
      Alert.alert(
        'Oops...',
        'Não foi possível ler o QR Code',
        [
          {
            text: "Ok",
            onPress: () => setIsVisibleCameraModal(false)
          }
        ]
      )
    } finally {
      setIsCouponIsFetching(false)
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false)

    Alert.alert(
      'Cupon',
      'Não é possível reutilizar um cupon resgatado. Deseja realmente resgatar o cupon?',
    [
      {
        text: "Cancelar",
        onPress: () => setIsVisibleCameraModal(true)
      },
      {
        text: "Resgatar",
        onPress: () => handleReadQRCode()
      }
    ])
  }

  useEffect(() => {
    fetchMarket()
  }, [id, coupon])

  if(isLoading) return <Loading />

  if(!data) return <Redirect href='/home' />

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle='light-content'
        hidden={isVisibleCameraModal}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Cover uri={data?.cover} />
        <Details data={data} />
        {coupon && <Coupon code={coupon}/>}
        <View style={{ padding: 32 }}>
          <Button onPress={handleOpenCamera}>
            <Button.Title>Ler QR Code</Button.Title>
          </Button>
        </View>
        <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
          <CameraView
            style={{ flex: 1 }}
            facing='back'
            onBarcodeScanned={({ data }) => {
              if(data && !qrLock.current) {
                qrLock.current = true
                //handleReadQRCode()
                setTimeout(() => {
                  handleUseCoupon(data)
                }, 500)
              }
            }}/>
          <View style={{ position: 'absolute', bottom: 32, left: 32, right: 32 }}>
            <Button
              onPress={() => setIsVisibleCameraModal(false)}
              isLoading={couponIsFetching}>
              <Button.Title>Voltar</Button.Title>
            </Button>
          </View>
        </Modal>
      </ScrollView>
    </View>
  )
}
