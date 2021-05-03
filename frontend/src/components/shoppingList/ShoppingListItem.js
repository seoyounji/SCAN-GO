import {Body, Left, ListItem, Right, Text, View} from 'native-base';
import React, {useCallback, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import {
  updateShoppingListItem,
  isCheckedShoppingListItem,
} from '../../modules/shoppingList';

const ShoppingListItem = ({
  imgUrl,
  isCheck,
  prodId,
  memberId,
  prodName,
  prodPrice,
  qty,
}) => {
  const dispatch = useDispatch();
  const onIncrease = () => {
    if (qty > 98) {
      dispatch(updateShoppingListItem({prodId, memberId: '1', qty: 99}));
      return;
    }
    dispatch(updateShoppingListItem({prodId, memberId: '1', qty: qty + 1}));
  };
  const onDecrease = () => {
    if (qty < 2) {
      dispatch(updateShoppingListItem({prodId, memberId: '1', qty: 1}));
      return;
    }
    dispatch(updateShoppingListItem({prodId, memberId: '1', qty: qty - 1}));
  };
  const onIsChecked = () => {
    dispatch(isCheckedShoppingListItem({prodId}));
  };

  return (
    <ListItem>
      <TouchableOpacity onPress={onIsChecked}>
        <Left style={listItemStyle.left2}>
          {isCheck ? (
            <Icon2 name={'check-box-outline'} style={listItemStyle.checkbox} />
          ) : (
            <Icon2
              name={'checkbox-blank-outline'}
              style={listItemStyle.checkbox}
            />
          )}
          <Image style={listItemStyle.left} source={imgUrl} />
        </Left>
      </TouchableOpacity>
      <Body style={listItemStyle.body}>
        <Text style={listItemStyle.bodyTextName} numberOfLines={2}>
          {prodName}
        </Text>
        <Text style={listItemStyle.bodyTextPrice} numberOfLines={1}>
          {prodPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Text>
      </Body>
      <Right style={listItemStyle.right}>
        <TouchableOpacity onPress={onDecrease}>
          <Icon style={listItemStyle.cntIcon} name="minus" />
        </TouchableOpacity>
        <Text style={listItemStyle.cntText}>{qty}</Text>
        <TouchableOpacity onPress={onIncrease}>
          <Icon style={listItemStyle.cntIcon} name="plus" />
        </TouchableOpacity>
      </Right>
    </ListItem>
  );
};
const listItemStyle = StyleSheet.create({
  checkboxFalse: {
    width: 15,
    height: 15,
    borderWidth: 1,
    borderColor: 'rgb(170,170,170)',
  },
  left2: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgb(170,170,170)',
  },
  body: {
    flex: 5,
  },
  bodyTextName: {
    fontSize: 15,
  },
  bodyTextPrice: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  left: {
    width: 60,
    height: 60,
  },
  right: {
    flex: 1,
    width: 50,
    height: 30,
    marginRight: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cntIcon: {
    fontSize: 19,
    color: 'rgb(100,100,100)',
  },
  cntText: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default ShoppingListItem;
