import { View, ActivityIndicator} from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { styles } from '../assets/styles/home.styles'

const PageLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  )
}

export default PageLoader