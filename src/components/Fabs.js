import React, {Component} from 'react'

import {Fab} from '@material-ui/core'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import Hotkeys from 'react-hot-keys'

import Vars from '../vars/vars.js'

const scrollPage = (direction) => {
  let elm = document.body
  // let elm = document.scrollingElement
  // const pageSize = elm.clientHeight - 256
  const pageSize = document.documentElement.clientHeight - 256
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

class Fabs extends Component {
  render() {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: 8,
          right: 8,
        }}
      >
        <div style={{marginBottom: 4}}>
          <Fab
            onClick={() => {scrollPage('up')}}
            style={{
              border: '2px solid black',
              backgroundColor: 'white',
              boxShadow: 'none',
              fontSize: 24,
            }}
          >
            <ArrowUpwardIcon
            />
          </Fab>
        </div>
        <div>
          <Fab
            onClick={() => {scrollPage('down')}}
            style={{
              border: '2px solid black',
              backgroundColor: 'white',
              boxShadow: 'none',
              fontSize: 24,
            }}
          >
            <ArrowDownwardIcon />
          </Fab>
        </div>
        <KeysUpDown />
      </div>
    )
  }
}

export default Fabs
