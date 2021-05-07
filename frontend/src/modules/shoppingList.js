import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import * as shoppingListApi from '../lib/api/shoppingList';

export const fetchShoppingList = createAsyncThunk(
  'shoppingList/fetchShoppingList',
  async (_, {getState, rejectWithValue}) => {
    try {
      const {userInfo} = getState();
      if (!userInfo.memberId) {
        throw Error('[fetchShoppingList] memberId 없음');
      }
      const response = await shoppingListApi.readItems(userInfo.memberId);
      return response.data;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  },
);
export const updateShoppingListItem = createAsyncThunk(
  'shoppingList/updateShoppingListItem',
  async ({prodId, qty}, {getState}) => {
    try {
      const {userInfo} = getState();
      if (!userInfo.memberId) {
        throw Error('[updateShoppingListItem] memberId 없음');
      }
      await shoppingListApi.updateItem({
        prodId,
        memberId: userInfo.memberId,
        qty,
      });
      return {prodId, qty};
    } catch (e) {
      console.log(e.message);
    }
  },
);
export const deleteShoppingListItem = createAsyncThunk(
  'shoppingList/deleteShoppingListItem',
  async ({prodIds}, {getState}) => {
    const {userInfo} = getState();
    if (!userInfo.memberId) {
      throw Error('[deleteShoppingListItem] memberId 없음');
    }
    //prodIds 배열
    try {
      await shoppingListApi.deleteItem({memberId: userInfo.memberId, prodIds});
      return prodIds;
    } catch (e) {
      console.log(e.message);
    }
  },
);

export const deleteAllShoppingListItem = createAsyncThunk(
  'shoppingList/deleteAllShoppingListItem',
  async (_, {getState}) => {
    //prodIds 배열
    try {
      const {userInfo} = getState();
      if (!userInfo.memberId) {
        throw Error('[deleteAllShoppingListItem] memberId 없음');
      }
      await shoppingListApi.deleteAllItem(userInfo.memberId);
    } catch (e) {
      console.log(e.message);
    }
  },
);
export const addShoppingListItemByBarcode = createAsyncThunk(
  'shoppingList/addShoppingListItemByBarcode',
  async (formData, {getState}) => {
    try {
      const {userInfo} = getState();
      if (!userInfo.memberId) {
        throw Error('[addShoppingListItemByBarcode] memberId 없음');
      }
      const response = await shoppingListApi.addItemByBarcode({
        ...formData,
        memberId: userInfo.memberId,
      });
      return response.data;
    } catch (e) {
      console.log(e.message);
    }
  },
);
const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState: {
    loading: false,
    hasErrors: false,
    paymentDetail: [],
    sumPrice: 0,
    lastItem: null,
  },
  reducers: {
    allCheckShoppingListItem: (state, {payload}) => {
      state.paymentDetail = state.paymentDetail.map(item => {
        return {...item, isCheck: payload};
      });
    },
    isCheckedShoppingListItem: (state, {payload}) => {
      state.paymentDetail = state.paymentDetail.map(item => {
        if (item.prodId === payload.prodId) {
          return {...item, isCheck: !item.isCheck};
        } else {
          return item;
        }
      });
    },
    removeLastItem: state => {
      console.log('removeLastItem!!!!!!!!!!');
      state.lastItem = null;
    },
  },
  extraReducers: {
    [fetchShoppingList.pending]: state => {
      state.loading = true;
    },
    [fetchShoppingList.fulfilled]: (state, {payload}) => {
      state.id = payload.id;
      state.storeId = payload.storeId;
      state.paymentDetail = payload.paymentDetail;
      let sum = 0;
      for (let item of payload.paymentDetail) {
        sum += Number(item.prodPrice) * Number(item.qty);
      }
      state.sumPrice = sum;
    },
    [fetchShoppingList.rejected]: (state, {payload}) => {
      state.loading = false;
      state.hasErrors = true;
      state.errorMsg = payload;
    },
    [updateShoppingListItem.fulfilled]: (state, {payload}) => {
      state.paymentDetail = state.paymentDetail.map(item => {
        if (item.prodId === payload.prodId) {
          console.log(payload.qty);
          state.sumPrice =
            state.sumPrice -
            Number(item.prodPrice) * Number(item.qty) +
            Number(item.prodPrice) * Number(payload.qty);
          return {...item, qty: payload.qty};
        } else {
          return item;
        }
      });
    },
    [deleteShoppingListItem.fulfilled]: (state, {payload}) => {
      state.paymentDetail = state.paymentDetail.filter(list => {
        for (let i of payload) {
          if (list.prodId === i) {
            console.log(list.prodPrice);
            state.sumPrice =
              state.sumPrice - Number(list.prodPrice) * Number(list.qty);
            return false;
          }
        }
        return true;
      });
    },
    [deleteAllShoppingListItem.fulfilled]: state => {
      state.paymentDetail = [];
      state.sumPrice = 0;
    },
    [addShoppingListItemByBarcode.pending]: state => {
      state.loading = true;
    },
    [addShoppingListItemByBarcode.fulfilled]: (state, {payload}) => {
      state.lastItem = payload;
      state.loading = false;
      state.hasErrors = false;
    },
    [addShoppingListItemByBarcode.rejected]: state => {
      state.loading = false;
      state.hasErrors = true;
    },
  },
});

export const {
  isCheckedShoppingListItem,
  allCheckShoppingListItem,
  removeLastItem,
} = shoppingListSlice.actions;
export default shoppingListSlice.reducer;
