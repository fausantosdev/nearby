import { Text, View } from 'react-native'
import { IconMapPin, IconQrcode, IconTicket } from '@tabler/icons-react-native'

import { s } from './styles'
import { Step } from '../step'

export function Steps() {
  return(
    <View style={s.container}>
      <Text style={s.title}>Veja como funciona</Text>
      <Step
        title='Encontre estabelecimentos'
        description='Veja locais perto de você que são parceiros do Nearby'
        icon={IconMapPin}/>
      <Step
        title='Ative o cupom com QR Code'
        description='Escaneie o código no estabelecimento para usar o benefício'
        icon={IconQrcode}/>
      <Step
        title='Garanta as vantagens perto de você'
        description='Ative copons de desconto onde estiver, em diferentes tipos de estabelecimentos'
        icon={IconTicket}/>
    </View>
  )
}
