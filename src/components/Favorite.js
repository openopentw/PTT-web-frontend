import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Link} from "react-router-dom"

import {ButtonBase, CircularProgress, Container, Typography} from '@material-ui/core'
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
    const {boardI, boardSize, setBoardI} = this.props
    if (keyName === 'up') {
      if (boardI > 0) {
        setBoardI(boardI - 1)
      }
    } else if (keyName === 'down') {
      if (boardI < boardSize - 1) {
        setBoardI(boardI + 1)
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
  state = {
    boardI: 0,
  }

  setBoardI = (boardI) => {
    this.setState({boardI})
  }

  componentDidMount = async () => {
    document.title = '我的最愛 - PTT'
    this.props.updateOverlay(Vars.overlay.initial)
    const {favTop} = this.props
    if (!favTop.in) {
      await this.props.fetchFav()
    } else {
      this.setBoardI(favTop.boardI)
    }
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    elm.scrollTop = favTop.top
  }

  componentWillUnmount = () => {
    this.props.updateTop(this.state.boardI)
  }

  render() {
    const {theme, boardList} = this.props
    const {boardI} = this.state
    const matchUrl = this.props.match.url
    const MyButton = theme === Vars.theme.eink? Link : ButtonBase
    return (
      <Container maxWidth="sm" style={{marginTop: 30, marginBottom: 30}}>
        {this.props.fetching? (
          <div style={{textAlign: 'center'}}>
            <CircularProgress thickness={2} size={64} />
          </div>
        ) : (
          <React.Fragment>
            {/*(theme === Vars.theme.eink || window.mobileCheck()) && (*/}
            {false && window.mobileCheck() && (
              <div style={{
                marginBottom: 32,
                textAlign: 'center',
              }} >
                <Link
                  to={`/search`}
                  class="button"
                  style={{
                    borderStyle: 'solid',
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 8,
                    color: 'black',
                    fontSize: 20,
                  }}
                >
                  搜尋看板
                </Link>
              </div>
            )}
            {boardList.map((b, i) => (
              <div key={i} >
                <MyButton
                  {...theme !== Vars.theme.eink? {
                    component: Link,
                  } : {
                    class: 'button',
                  }}
                  to={`${matchUrl}/${b.board}`}
                  onMouseEnter={() => {
                    if (theme !== Vars.theme.eink) {
                      this.setBoardI(i)
                    }
                  }}
                  style={{
                    width: '100%',
                    ...theme === Vars.theme.eink? {
                      display: 'block',
                      borderStyle: 'solid',
                      borderColor: 'black',
                      borderWidth: '1px 0 0 0',
                      borderRadius: 0,
                    } : {
                      justifyContent: 'flex-start',
                      backgroundColor: colors.grey[200],
                    },
                    ...b.board === Vars.board.emptyBoard? {
                      pointerEvents: 'none',
                      backgroundColor: 'transparent',
                    } : {},
                  }}
                >
                  {theme !== Vars.theme.eink && !window.mobileCheck() && (
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                      <ArrowForwardIcon style={{color: boardI === i? 'black' : 'transparent'}}/>
                    </div>
                  )}
                  {b.board === '----------'? (
                    <div style={{height: 32}}></div>
                  ) : (
                    <div style={{paddingTop: 8, paddingBottom: 8}}>
                      <Typography variant="h6" color="textPrimary">
                        {b.board}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {b.title}
                      </Typography>
                    </div>
                  )}
                </MyButton>
              </div>
            ))}
            {theme === Vars.theme.eink && (
              <div style={{borderTop: '1px solid black'}}/>
            )}
            {theme !== Vars.theme.eink && !window.mobileCheck() && (
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
                  setBoardI={this.setBoardI}
                />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Container>
    )
  }
}

export default withRouter(Favorite)
