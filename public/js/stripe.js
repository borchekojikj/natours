/* eslint-disable */
// const stripe = Stripe(process.env.STRIPE_PUBLIC_KEY);
// console.log(stripe);
import axios from 'axios';

export const bookTour = async tourId => {
  // 1) Get Session from Server-API-Endpoint

  const session = await axios({
    url: `/api/v1/boooking/checkout-session/${tourId}`
  });
  window.location.replace(session.data.session.url);
  // 2) Create checkout form + charge card
};
