import React, {Component} from 'react'

import {Fab} from '@material-ui/core'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import Hotkeys from 'react-hot-keys'

import Vars from '../vars/Vars.js'

const scrollPage = (direction) => {
  let elm = document.body
  // let elm = document.scrollingElement
  // const pageSize = elm.clientHeight - 256
  const pageSize = document.documentElement.clientHeight - 64
  if (direction === 'down') {
    elm.scrollTop = Math.min(elm.scrollTop + pageSize, elm.scrollHeight)
  } else if (direction === 'up') {
    elm.scrollTop = Math.max(elm.scrollTop - pageSize, 0)
  }
}

class KeysUpDown extends Component {
  scroll = (keyName, e, handle) => {
    scrollPage(keyName)
  }

  render() {
    return (
      <Hotkeys
        keyName="up,down"
        onKeyDown={this.scroll}
        allowRepeat={true}
      />
    )
  }
}

const buttonStyle = {
  display: 'inline-block',
  overflow: 'hidden',
  border: '1px solid black',
  backgroundColor: 'white',
  width: 32,
  height: 32,
  padding: 4,
  fontSize: 64,
  borderRadius: 5,
  textAlign: 'center',
  lineHeight: 0.1,
}

class Fabs extends Component {
  render() {
    return (
      <div style={{
        position: 'fixed',
        bottom: 8,
        right: 8,
      }} >
        {/*
        <a class="button" href="javascript:void(0)" onClick={scrollPage('up')} style={buttonStyle} >
          <ArrowUpwardIcon fontSize="inherit" />
        </a>
        <a class="button" href="javascript:void(0)" onClick={scrollPage('down')} style={buttonStyle} >
          <ArrowDownwardIcon fontSize="inherit" />
        </a>
        */}
        <KeysUpDown />
      </div>
    )
  }
}

export default Fabs
