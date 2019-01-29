import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  ScrollView,
  AsyncStorage,
  BackHandler
} from 'react-native';
import {
  _loadDeals,
  _loadDealItem
} from '../../../../src/services/DealServices';
import { Button } from 'react-native-elements';
// import { _verifier } from "../../../../src/AuthentificationService";
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { _loadPosts } from "./PostService";
// import { Component } from 'react';
// import { SearchBar } from 'react-native-elements';

// EXTERNAL STYLESHEET
const styles = require('../../../assets/stylesheet/style');

// class FlatListItem extends Component {
//   render() {
//     return(
//       <View>
//         <TohomePchableOpacity style={styles.postStyle} key={this.props.item.id}>
//             <Image
//               style={{ width: 150, height: 150 }}
//               source={{ url: this.props.item.featured_deal_image }}
//             />
//             <View style={{ marginLeft: 20, flex: 1 }}>
//               <Text style={styles.textStyle}>{this.props.item.deal_name}</Text>
//               <Text>{this.props.item.information}</Text>

//                 <Text style={{
//                   alignContent: "flex-end",
//                   marginLeft: 120,
//                   marginTop: 10
//                 }}>
//                   {"$" + this.props.item.pay_in_crypto}
//                 </Text>
//             </View>
//         </TouchableOpacity>
//       </View>
//     );
//   }
// }

export default class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      isLoading: true,
      isFetching: false,
      data: {},
      search: '',
      post: '',
      dealsData: [],
      categories: [
        {
          name: 'Furniture',
          image:
            'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        },
        {
          name: 'Grocery',
          image:
            'https://images.pexels.com/photos/1327211/pexels-photo-1327211.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        },
        {
          name: 'Gift Card',
          image:
            'https://images.pexels.com/photos/1471686/pexels-photo-1471686.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        },
        {
          name: 'Pet',
          image:
            'https://images.pexels.com/photos/545063/pexels-photo-545063.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        },
        {
          name: 'Charity',
          image:
            'https://images.pexels.com/photos/1409716/pexels-photo-1409716.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        },
        {
          name: 'Toy',
          image:
            'https://images.pexels.com/photos/591652/play-fun-blocks-block-591652.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
        }
      ]
    };
  }

  componentDidMount = () => {
    this.getDealsData();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      BackHandler.exitApp();
      return true;
    });
  };

  getDealsData = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        return _loadDeals(value).then(res => {
          console.log('FETCHING' + res);
          this.setState({
            isLoading: false,
            isFetching: false,
            dealsData: res.deals
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentWillUnmount() {
    this.backHandler.remove();
  }

  convertToPercentage = (priceInDollar, priceInCrypto) => {
    return parseInt(((priceInDollar - priceInCrypto) / priceInDollar) * 100);
  };

  searchPost = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        _loadDeals(value)
          .then(resJSON => {
            console.log(resJSON);
            let searchData = resJSON.deals.filter(postData => {
              console.log('POST ' + postData);
              return postData.deal_name.includes(this.state.search);
            });
            this.setState({ dealsData: searchData });
          })
          .catch(err => console.log(err));
      }
    } catch (error) {
      console.log('TOKEN ERROR' + error);
    }
  };

  viewCategory = category => {
    console.log('LINE 115 IN category.JS FILE: ' + JSON.stringify(category));
    this.props.navigation.navigate('DealsScreen', {
      department: category
    });
  };

  viewPost = post => {
    console.log('LINE 115 IN POST.JS FILE: ' + JSON.stringify(post));
    this.props.navigation.navigate('DealsInfo', {
      id: post.id,
      deal_name: post.deal_name,
      description: post.deal_description,
      featured_deal_image: post.featured_deal_image,
      pay_in_dollar: post.pay_in_dollar.toFixed(2),
      pay_in_crypto: post.pay_in_crypto.toFixed(2)
    });
  };

  _keyExtractor = (item, index) => JSON.stringify(item.id);

  onRefresh = () => {
    this.setState({ isFetching: true }, function() {
      this.getDealsData();
    });
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    } else {
      return (
        <ScrollView style={styles.dealsContainer}>
          <TouchableOpacity
            style={{ flexDirection: 'row', marginBottom: 7 }}
            onPress={() => this.viewCategory('All Categories')}
          >
            <Text style={{ color: '#2e4158', padding: 10, fontSize: 25 }}>
              All Departments
            </Text>
            <Image
              source={require('../../../assets/images/category-icon.png')}
              style={{
                height: 20,
                width: 50,
                resizeMode: 'contain',
                marginTop: 17,
                marginLeft: -18
              }}
            />
          </TouchableOpacity>
          <ScrollView horizontal={true}>
            {/* <FlatList
            data={this.state.categories}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            renderItem={({ item, index }) => {
              let pic = `../../../assets/images/categories/${item}.jpeg`;
              console.log('PIX' + JSON.stringify(item));
              <View>
                <TouchableOpacity
                  style={styles.homePostStyle}
                  onPress={() => this.viewCategory(item.name)}
                >
                  <Image
                    style={{ width: 150, height: 150, borderRadius: 20 }}
                    source={{ uri: item.image }}
                  />
                </TouchableOpacity>
              </View>;
            }}
          /> */}
            <View>
              <TouchableOpacity
                style={styles.homePostStyle}
                onPress={() => this.viewCategory('Furniture')}
              >
                <Image
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={require('../../../assets/images/categories/furniture.jpeg')}
                />
                {/* <View
                  style={{
                    width: 80,
                    backgroundColor: 'white',
                    marginLeft: 10,
                    marginTop: -25,
                    // borderWidth: 2,
                    // borderColor: 'black',
                    borderRadius: 5
                  }}
                > */}
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    marginTop: 5
                    // color: 'black'
                  }}
                >
                  Furniture
                </Text>
                {/* </View> */}
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.homePostStyle}
                onPress={() => this.viewCategory('Grocery')}
              >
                <Image
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={require('../../../assets/images/categories/grocery.jpeg')}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    marginTop: 5
                    // color: 'black'
                  }}
                >
                  Grocery
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.homePostStyle}
                onPress={() => this.viewCategory('Gift Card')}
              >
                <Image
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={require('../../../assets/images/categories/gift-card.jpeg')}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    marginTop: 5
                    // color: 'black'
                  }}
                >
                  Gift Card
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.homePostStyle}
                onPress={() => this.viewCategory('Pet')}
              >
                <Image
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={require('../../../assets/images/categories/pet.jpeg')}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    marginTop: 5
                    // color: 'black'
                  }}
                >
                  Pet
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.homePostStyle}
                onPress={() => this.viewCategory('Charity')}
              >
                <Image
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={require('../../../assets/images/categories/charity.jpeg')}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    marginTop: 5
                    // color: 'black'
                  }}
                >
                  Charity
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={styles.homePostStyle}
                onPress={() => this.viewCategory('Toy')}
              >
                <Image
                  style={{ width: 100, height: 100, borderRadius: 50 }}
                  source={require('../../../assets/images/categories/toy.jpeg')}
                />
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 20,
                    marginTop: 5
                    // color: 'black'
                  }}
                >
                  Toy
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7 }}
            onPress={() => this.viewCategory('Furniture')}
          >
            <Text style={{ color: '#2e4158', padding: 10, fontSize: 25 }}>
              Furniture
            </Text>
            <Image
              source={require('../../../assets/images/category-icon.png')}
              style={{
                height: 20,
                width: 50,
                resizeMode: 'contain',
                marginTop: 17,
                marginLeft: -18
              }}
            />
          </TouchableOpacity>
          <FlatList
            data={this.state.dealsData}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            // refreshing={this.state.isFetching}
            // onRefresh={() => this.onRefresh()}
            renderItem={({ item, index }) => {
              console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
              if (item.category === 'Furniture') {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.homePostStyle}
                      key={item.id}
                      onPress={() => this.viewPost(item)}
                    >
                      <Image
                        style={{ width: 150, height: 150, borderRadius: 20 }}
                        source={{ uri: item.featured_deal_image }}
                      />
                      <View
                        style={{
                          width: 80,
                          backgroundColor: 'white',
                          marginLeft: 10,
                          marginTop: -25,
                          borderWidth: 2,
                          borderColor: 'red',
                          borderRadius: 5
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            color: 'red'
                          }}
                        >
                          {' ' +
                            this.convertToPercentage(
                              item.pay_in_dollar,
                              item.pay_in_crypto
                            ) +
                            '% OFF '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          />

          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7 }}
            onPress={() => this.viewCategory('Grocery')}
          >
            <Text style={{ color: '#2e4158', padding: 10, fontSize: 25 }}>
              Grocery
            </Text>
            <Image
              source={require('../../../assets/images/category-icon.png')}
              style={{
                height: 20,
                width: 50,
                resizeMode: 'contain',
                marginTop: 17,
                marginLeft: -18
              }}
            />
          </TouchableOpacity>
          <FlatList
            data={this.state.dealsData}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            // refreshing={this.state.isFetching}
            // onRefresh={() => this.onRefresh()}
            renderItem={({ item, index }) => {
              console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
              if (item.category === 'Grocery') {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.homePostStyle}
                      key={item.id}
                      onPress={() => this.viewPost(item)}
                    >
                      <Image
                        style={{ width: 150, height: 150, borderRadius: 20 }}
                        source={{ uri: item.featured_deal_image }}
                      />
                      <View
                        style={{
                          width: 80,
                          backgroundColor: 'white',
                          marginLeft: 10,
                          marginTop: -25,
                          borderWidth: 2,
                          borderColor: 'red',
                          borderRadius: 5
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            color: 'red'
                          }}
                        >
                          {' ' +
                            this.convertToPercentage(
                              item.pay_in_dollar,
                              item.pay_in_crypto
                            ) +
                            '% OFF '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          />

          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7 }}
            onPress={() => this.viewCategory('Gift Card')}
          >
            <Text style={{ color: '#2e4158', padding: 10, fontSize: 25 }}>
              Gift Card
            </Text>
            <Image
              source={require('../../../assets/images/category-icon.png')}
              style={{
                height: 20,
                width: 50,
                resizeMode: 'contain',
                marginTop: 17,
                marginLeft: -18
              }}
            />
          </TouchableOpacity>
          <FlatList
            data={this.state.dealsData}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            // refreshing={this.state.isFetching}
            // onRefresh={() => this.onRefresh()}
            renderItem={({ item, index }) => {
              console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
              if (item.category === 'Gift Card') {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.homePostStyle}
                      key={item.id}
                      onPress={() => this.viewPost(item)}
                    >
                      <Image
                        style={{ width: 150, height: 150, borderRadius: 20 }}
                        source={{ uri: item.featured_deal_image }}
                      />
                      <View
                        style={{
                          width: 80,
                          backgroundColor: 'white',
                          marginLeft: 10,
                          marginTop: -25,
                          borderWidth: 2,
                          borderColor: 'red',
                          borderRadius: 5
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            color: 'red'
                          }}
                        >
                          {' ' +
                            this.convertToPercentage(
                              item.pay_in_dollar,
                              item.pay_in_crypto
                            ) +
                            '% OFF '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          />

          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7 }}
            onPress={() => this.viewCategory('Pet')}
          >
            <Text style={{ color: '#2e4158', padding: 10, fontSize: 25 }}>
              Pet
            </Text>
            <Image
              source={require('../../../assets/images/category-icon.png')}
              style={{
                height: 20,
                width: 50,
                resizeMode: 'contain',
                marginTop: 17,
                marginLeft: -18
              }}
            />
          </TouchableOpacity>
          <FlatList
            data={this.state.dealsData}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            // refreshing={this.state.isFetching}
            // onRefresh={() => this.onRefresh()}
            renderItem={({ item, index }) => {
              console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
              if (item.category === 'Pet') {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.homePostStyle}
                      key={item.id}
                      onPress={() => this.viewPost(item)}
                    >
                      <Image
                        style={{ width: 150, height: 150, borderRadius: 20 }}
                        source={{ uri: item.featured_deal_image }}
                      />
                      <View
                        style={{
                          width: 80,
                          backgroundColor: 'white',
                          marginLeft: 10,
                          marginTop: -25,
                          borderWidth: 2,
                          borderColor: 'red',
                          borderRadius: 5
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            color: 'red'
                          }}
                        >
                          {' ' +
                            this.convertToPercentage(
                              item.pay_in_dollar,
                              item.pay_in_crypto
                            ) +
                            '% OFF '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          />

          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7 }}
            onPress={() => this.viewCategory('Charity')}
          >
            <Text style={{ color: '#2e4158', padding: 10, fontSize: 25 }}>
              Charity
            </Text>
            <Image
              source={require('../../../assets/images/category-icon.png')}
              style={{
                height: 20,
                width: 50,
                resizeMode: 'contain',
                marginTop: 17,
                marginLeft: -18
              }}
            />
          </TouchableOpacity>
          <FlatList
            data={this.state.dealsData}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            // refreshing={this.state.isFetching}
            // onRefresh={() => this.onRefresh()}
            renderItem={({ item, index }) => {
              console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
              if (item.category === 'Charity') {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.homePostStyle}
                      key={item.id}
                      onPress={() => this.viewPost(item)}
                    >
                      <Image
                        style={{ width: 150, height: 150, borderRadius: 20 }}
                        source={{ uri: item.featured_deal_image }}
                      />
                      <View
                        style={{
                          width: 80,
                          backgroundColor: 'white',
                          marginLeft: 10,
                          marginTop: -25,
                          borderWidth: 2,
                          borderColor: 'red',
                          borderRadius: 5
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            color: 'red'
                          }}
                        >
                          {' ' +
                            this.convertToPercentage(
                              item.pay_in_dollar,
                              item.pay_in_crypto
                            ) +
                            '% OFF '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          />

          <TouchableOpacity
            style={{ flexDirection: 'row', marginTop: 7, marginBottom: 7 }}
            onPress={() => this.viewCategory('Toy')}
          >
            <Text style={{ color: '#2e4158', padding: 10, fontSize: 25 }}>
              Toy
            </Text>
            <Image
              source={require('../../../assets/images/category-icon.png')}
              style={{
                height: 20,
                width: 50,
                resizeMode: 'contain',
                marginTop: 17,
                marginLeft: -18
              }}
            />
          </TouchableOpacity>
          <FlatList
            data={this.state.dealsData}
            keyExtractor={this._keyExtractor}
            horizontal={true}
            // refreshing={this.state.isFetching}
            // onRefresh={() => this.onRefresh()}
            renderItem={({ item, index }) => {
              console.log(`Item = ${JSON.stringify(item)}, index = ${index}`);
              if (item.category === 'Toy') {
                return (
                  <View>
                    <TouchableOpacity
                      style={styles.homePostStyle}
                      key={item.id}
                      onPress={() => this.viewPost(item)}
                    >
                      <Image
                        style={{ width: 150, height: 150, borderRadius: 20 }}
                        source={{ uri: item.featured_deal_image }}
                      />
                      <View
                        style={{
                          width: 80,
                          backgroundColor: 'white',
                          marginLeft: 10,
                          marginTop: -25,
                          borderWidth: 2,
                          borderColor: 'red',
                          borderRadius: 5
                        }}
                      >
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 15,
                            color: 'red'
                          }}
                        >
                          {' ' +
                            this.convertToPercentage(
                              item.pay_in_dollar,
                              item.pay_in_crypto
                            ) +
                            '% OFF '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              }
            }}
          />

          {/*}
          <TouchableOpacity
            style={{
            borderWidth:1,
            borderColor: '#2e4158',
            alignItems:'center',
            justifyContent:'center',
            width:70,
            height:70,
            position: 'absolute',
            bottom: 0,
            marginLeft: 10,
            marginBottom: 10,
            backgroundColor:'#2e4158',
            borderRadius:100,
            }}
            onPress={() => this.props.navigation.navigate("AddPost")}
           >
            <Icon name="plus"  size={30} color="#fff" />
          </TouchableOpacity> */}
        </ScrollView>
      );
    }
  }
}

// const styles = StyleSheet.create({
// container: {
//   flex: 1,
//   backgroundColor: '#2e4158',
//   alignSelf: 'stretch',
//   flexDirection: 'column'
// },
//   searchButtonStyle: {
//     backgroundColor: 'orange',
//     width: 50,
//     height: 45,
//     alignContent: 'center',
//     borderRadius: 5
//   },
//   buyButtonStyle: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: 'bold',
//     borderRadius: 10,
//     backgroundColor: '#2e4158',
//     padding: 10,
//     flex: 1,
//     textAlign: 'center'
//   }
// });
{
  /*<FlatListItem item={item} index={index}>
              
              </FlatListItem>);*/
}