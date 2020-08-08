import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Link} from "react-router-dom"

import {ButtonBase, Card, Container, Divider, Paper, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Hotkeys from 'react-hot-keys'

import Vars from '../vars/Vars.js'

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
    if (keyName === 'up') {
      if (boardI > 0) {
        handleBoardIChange(boardI - 1)
      }
    } else if (keyName === 'down') {
      if (boardI < boardSize - 1) {
        handleBoardIChange(boardI + 1)
      }
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
  componentDidMount = async () => {
    const {favTop} = this.props
    if (!favTop.in) {
      await this.props.fetchFav()
    }
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    elm.scrollTop = favTop.top
  }

  componentWillUnmount = async () => {
    this.props.updateTop(Vars.overlay.initial)
  }

  render() {
    const {theme, boardList, boardI, handleBoardIChange} = this.props
    const matchUrl = this.props.match.url
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
              component={Link}
              to={`${matchUrl}/${b.board}`}
              onMouseEnter={() => {handleBoardIChange(i)}}
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                textAlign: 'initial',
                width: '100%',
                ...(theme === Vars.theme.eink? {
                  paddingLeft: 32,
                  paddingRight: 32,
                } : {}),
                ...(b.board === Vars.board.emptyBoard? {
                  pointerEvents: 'none',
                } : {}),
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
            <KeysRight handleBoardChange={() => {
              const board = boardList[boardI].board
              if (board !== Vars.board.emptyBoard) {
                this.props.history.push(`${matchUrl}/${board}`)
              }
            }} />
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

export default withRouter(Favorite)
