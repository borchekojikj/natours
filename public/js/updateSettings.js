/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import catchAsync from '../../utils/catchAsync';

// Type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  console.log(data);
  try {
    // api / v1 / users / updateMe;
    const url =
      type === 'password'
        ? `/api/v1/users/updateMyPassword`
        : `/api/v1/users/updateMe`;

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `Your ${type.toUpperCase()}  has been updated!`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
