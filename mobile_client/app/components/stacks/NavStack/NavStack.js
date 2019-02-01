import * as React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator
} from 'react-navigation';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Home from '../../screens/HomeScreen/HomeScreen';
import Search from '../../screens/SearchScreen/SearchScreen';
import Venues from '../../screens/VenuesScreen/VenuesScreen';
import DealsScreen from '../../screens/DealsScreen/DealsScreen';
import DealsInfo from '../../screens/DealsScreen/DealsInfo';
import DealsCheckout from '../../screens/DealsScreen/DealsCheckout';
import ProfileScreen from '../../screens/ProfileScreen/ProfileScreen';
import LogoTitle from './LogoTitle';
import SearchTitle from './SearchTitle';
import Feather from '@expo/vector-icons/Feather';

const header = {
  headerTitle: <LogoTitle />,
  headerStyle: {
    backgroundColor: '#66dac7'
  }
};

var color = '#66dac7';
if (Platform.OS === 'android') {
  var color = 'white';
}

const HomeHeader = {
  headerTitle: <SearchTitle />,
  headerStyle: {
    backgroundColor: color
  }
};

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    DealsScreen: {
      screen: DealsScreen,
      navigationOptions: header,
      headerLayoutPreset: 'center'
    },
    DealsInfo: {
      screen: DealsInfo,
      navigationOptions: header,
      headerLayoutPreset: 'center'
    },
    DealsCheckout: {
      screen: DealsCheckout,
      navigationOptions: header,
      headerLayoutPreset: 'center'
    }
  },
  {
    navigationOptions: HomeHeader,
    headerLayoutPreset: 'center'
  }
);

const SearchStack = createStackNavigator(
  {
    Search: {
      screen: Search
    }
  },
  {
    navigationOptions: header,
    headerLayoutPreset: 'center'
  }
);

const VenuesStack = createStackNavigator(
  {
    Venues: {
      screen: Venues
    }
  },
  {
    navigationOptions: header,
    headerLayoutPreset: 'center'
  }
);

// const DealsStack = createStackNavigator(
//   {
//     Deals: {
//       screen: Deals
//     },
//     DealsInfo: {
//       screen: DealsInfo
//     },
//     DealsCheckout: {
//       screen: DealsCheckout,
//     }
//   },
//   {
//     navigationOptions: header,
//     headerLayoutPreset: 'center'
//   }
// );

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen
    }
  },
  {
    navigationOptions: header,
    headerLayoutPreset: 'center'
  }
);

export default createBottomTabNavigator(
  {
    Home: HomeStack,
    Search: SearchStack,
    Venues: VenuesStack,
    // Deals: DealsStack,
    Profile: ProfileStack
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `home`;
        } else if (routeName === 'Search') {
          return (
            <Feather
              name={'search'}
              size={horizontal ? 20 : 25}
              color={tintColor}
              style={{ backgroundColor: '#2e4158' }}
            />
          );
        } else if (routeName === 'Venues') {
          iconName = 'chart-arc';
        } else if (routeName === 'Profile') {
          iconName = `account-box`;
        }
        return (
          <MaterialCommunityIcons
            name={iconName}
            size={horizontal ? 20 : 25}
            color={tintColor}
            style={{ backgroundColor: '#2e4158' }}
          />
        );
      }
    }),
    tabBarOptions: {
      style: {
        backgroundColor: '#2e4158',
        borderTopColor: '#40556e',
        borderTopWidth: 3
      },
      activeTintColor: '#66dac7',
      inactiveTintColor: '#fff',
      showLabel: false
    }
  }
);
