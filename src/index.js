import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import App from './components/App';
import { BrowserRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
