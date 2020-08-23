import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Link} from "react-router-dom"

import {ButtonBase, Card, CircularProgress, Container, Typography} from '@material-ui/core'
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
    return (
      <Container maxWidth="sm" style={{marginTop: 30, marginBottom: 30}}>
        {this.props.fetching? (
          <div style={{textAlign: 'center'}}>
            <CircularProgress
              thickness={2}
              size={64}
            />
          </div>
        ) : (
          <React.Fragment>
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
                  {...theme === Vars.theme.eink? {
                    onClick: () => {this.props.history.push(`${matchUrl}/${b.board}`)}
                  } : {
                    component: Link,
                    to: `${matchUrl}/${b.board}`,
                  }}
                  onMouseEnter={() => {this.setBoardI(i)}}
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
                        <Typography variant="h6" color="textPrimary">
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
                  setBoardI={this.setBoardI}
                />
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export default withRouter(Favorite)
