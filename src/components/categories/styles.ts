import { StyleSheet } from 'react-native'

import { colors } from '@/styles/colors'

export const s = StyleSheet.create({
  container: {
    maxHeight: 36,
    position: 'absolute',
    zIndex: 1,
    top: 40,
    /*borderWidth: 2, borderColor: 'red'*/
  },

  content: {
    gap: 8,
    paddingHorizontal: 24
  }
})
