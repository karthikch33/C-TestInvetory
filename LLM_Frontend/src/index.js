import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './components/app/store';
    

const root = ReactDOM.createRoot(document.getElementById('root'));
root?.render(
    <Provider store={store}>
    <App  className='main-part'/>
    </Provider>
);


// myenv\Scripts\activate
