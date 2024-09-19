/* eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { logout } from './login';
import { displayMap } from './leaflet';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
document.addEventListener('DOMContentLoaded', () => {
  // DOM ELEMENTS
  const leaflet = document.getElementById('map');
  const form = document.querySelector('.form--login');
  const logOutBtn = document.querySelector('.nav__el--logout');
  const updateForm = document.querySelector('.form-user-data');
  const updateFormPassword = document.querySelector('.form-user-password');
  const bookBtn = document.getElementById('book-tour');

  // INITIALIZE MAP
  if (leaflet) {
    try {
      const locationsData = JSON.parse(leaflet.dataset.locations);
      displayMap(locationsData);
    } catch (error) {
      console.error('Error parsing map locations data:', error);
    }
  }

  // HANDLE FORM SUBMISSION
  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      try {
        await login(email, password);
      } catch (error) {
        console.error('Login failed:', error);
        showAlert('error', 'Error logging in, please try again.');
      }
    });
  }

  // HANDLE LOGOUT
  if (logOutBtn) {
    logOutBtn.addEventListener('click', async () => {
      try {
        await logout();
      } catch (error) {
        console.error('Logout failed:', error);
        showAlert('error', 'Error logging out, please try again.');
      }
    });
  }

  if (updateForm) {
    updateForm.addEventListener('submit', async e => {
      e.preventDefault();

      const form = new FormData();
      form.append('name', document.getElementById('name').value);
      form.append('email', document.getElementById('email').value);
      form.append('photo', document.getElementById('photo').files[0]);

      try {
        await updateSettings(form, 'data');
      } catch (error) {
        console.error('Update failed:', error);
        showAlert('error', 'Error updating you data, please try again.');
      }
    });
  }

  if (updateFormPassword) {
    updateFormPassword.addEventListener('submit', async e => {
      e.preventDefault();
      document.querySelector('.btn--save-password').textContent = 'Updating...';
      const passwordCurrent = document.getElementById('password-current').value;
      const password = document.getElementById('password').value;
      const passwordConfirm = document.getElementById('password-confirm').value;
      await updateSettings(
        { passwordCurrent, password, passwordConfirm },
        'password'
      );

      document.querySelector('.btn--save-password').textContent =
        'Save password';
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
    });
  }

  // Booking Tour

  if (bookBtn) {
    bookBtn.addEventListener('click', e => {
      e.target.textContent = 'Processing...';
      const tourId = e.target.dataset.tourId;
      bookTour(tourId);
    });
  }
});
