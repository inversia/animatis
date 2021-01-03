import 'panic-overlay'
import 'reset-css'
import './index.scss'

import React from 'react'
import { render } from 'react-dom'

import { Program } from './program'

function App() {
  return <Program />
}

render(<Program />, document.getElementById('root'))
