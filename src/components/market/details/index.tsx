import { Text, View } from 'react-native'
import { IconPhone, IconMapPin, IconTicket } from '@tabler/icons-react-native'

import { s } from './styles'
import { colors } from '@/styles/colors'
import { Button } from '@/components/button'
import { Info } from '../info'

export type DetailsProps = {
  name: string
  description: string
  address: string
  phone: string
  coupons: number
  cover: string
  rules: {
    id: string
    description: string
  }[]
}

type Props = {
  data: DetailsProps
}

export function Details(props: Props) {
  const { name, description } = props.data

  return(
    <View style={s.container}>
      <Text style={s.name}>{name}</Text>
      <Text style={s.description}>{description}</Text>

      <View style={s.group}>
        <Text style={s.title}>Informações</Text>
        <Info icon={IconTicket} description={`${props.data.coupons} cupons disponíveis`} />
        <Info icon={IconMapPin} description={props.data.address} />
        <Info icon={IconPhone} description={props.data.phone} />
      </View>

      <View style={s.group}>
        <Text style={s.title}>Regulamento</Text>
        {props.data.rules.map(rule => (
          <Text
            key={rule.id}
            style={s.rule}>
            {`\u2022 ${rule.description}`}
          </Text>
        ))}
      </View>
    </View>
  )
}
