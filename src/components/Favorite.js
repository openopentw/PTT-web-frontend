import React, {Component} from 'react'

import {ButtonBase, Card, Container, Divider, Paper, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Hotkeys from 'react-hot-keys'

import Vars from '../vars/vars.js'

class KeysRight extends Component {
  render() {
    const {handleBoardChange} = this.props
    return (
      <Hotkeys
        keyName="right"
        onKeyUp={handleBoardChange}
      />
    )
  }
}

class KeysUpDown extends Component {
  scrollInt = 32

  changeId = (keyName, e, handle) => {
    const {boardI, boardSize, handleBoardIChange} = this.props
    let elm = document.getElementById('overlay-initial')
    if (keyName === 'up') {
      if (boardI > 0) {
        handleBoardIChange(boardI - 1)
      }
      elm.scrollTop = Math.max(0, elm.scrollTop - this.scrollInt)
    } else if (keyName === 'down') {
      if (boardI < boardSize - 1) {
        handleBoardIChange(boardI + 1)
      }
      elm.scrollTop = Math.min(elm.scrollHeight, elm.scrollTop + this.scrollInt)
    }
  }

  render() {
    return (
      <Hotkeys
        keyName="up,down"
        onKeyDown={this.changeId}
        allowRepeat={true}
      />
    )
  }
}

class Favorite extends Component {
  componentDidMount = () => {
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    elm.scrollTop = this.props.favTop
  }

  componentWillUnmount = async () => {
    this.props.updateTop(Vars.overlay.initial)
  }

  render() {
    const {theme, boardList, boardI, isView, handleBoardChange, handleBoardIChange} = this.props
    return (
      <Container maxWidth="sm" style={{marginTop: 30}}>
        {boardList.map((b, i) => (
          <Card
            key={i}
            style={{
              // display: 'flex',
              backgroundColor: b.board === '----------'? 'transparent' :
                               theme === Vars.theme.eink? 'white': '',
              border: b.board === '----------'? 'transparent' :
                      theme === Vars.theme.eink? '2px solid black' : '',
              borderRadius: 5,
              boxShadow: 'none',
            }}
          >
            <ButtonBase
              onClick={handleBoardChange}
              onMouseEnter={() => {handleBoardIChange(i)}}
              style={theme === Vars.theme.eink? {
                display: 'flex',
                justifyContent: 'flex-start',
                textAlign: 'initial',
                width: '100%',
                paddingLeft: 32,
                paddingRight: 32,
              } : {
                display: 'flex',
                justifyContent: 'flex-start',
                textAlign: 'initial',
                width: '100%',
              }}
            >
              {theme === Vars.theme.eink? null : (
                <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                  <ArrowForwardIcon style={{color: boardI === i? 'black' : 'transparent'}}/>
                </div>
              )}
              {b.board === '----------'? (
                <div style={{height: 32}}></div>
              ) : (
                <div style={{}}>
                  <div style={{paddingTop: 8, paddingBottom: 8}}>
                    <Typography variant="h5" color="textPrimary">
                      {b.board}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {b.title}
                    </Typography>
                  </div>
                </div>
              )}
            </ButtonBase>
          </Card>
        ))}
        {theme !== Vars.theme.eink? (
          <React.Fragment>
            <KeysRight handleBoardChange={handleBoardChange} />
            <KeysUpDown
              boardI={boardI}
              boardSize={boardList.length}
              handleBoardIChange={handleBoardIChange}
            />
          </React.Fragment>
        ) : null}
      </Container>
    );
  }
}

export default Favorite
