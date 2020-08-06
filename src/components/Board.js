import React, {Component} from 'react'

import {ButtonBase, Container, Card, Paper, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Hotkeys from 'react-hot-keys'

import Vars from '../vars/vars.js'

class KeysRight extends Component {
  render() {
    const {handlePostChange} = this.props
    return (
      <Hotkeys
        keyName="right"
        onKeyUp={handlePostChange}
      />
    )
  }
}

class KeysUpDown extends Component {
  changeId = (keyName, e, handle) => {
    const {postI, artSize, handlePostIChange} = this.props
    if (keyName === 'down') {
      if (postI > 0) {
        handlePostIChange(postI - 1)
      }
    } else if (keyName === 'up') {
      if (postI < artSize - 1) {
        handlePostIChange(postI + 1)
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

class Board extends Component {
  handleScroll = () => {
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    const {boardFetching, handleBoardMore} = this.props
    if (!boardFetching && elm.scrollTop < 1024) {
      // console.log(elm.scrollTop)
      handleBoardMore()
    }
  }

  componentDidMount = () => {
    const {boardTop, boardI, theme} = this.props
    let elm = theme === Vars.theme.eink? document.body : document.scrollingElement
    elm.scrollTop = boardTop.InI !== boardI? elm.scrollHeight : boardTop.top
    window.addEventListener('scroll', this.handleScroll)
    this.props.boardFetchComplete()
  }

  componentDidUpdate = () => {
    // const {boardFetchComplete} = this.props
    // boardFetchComplete()
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll)
    this.props.updateTop(Vars.overlay.board)
  }

  render() {
    const {theme, postList, postI, isView, handlePostChange, handlePostIChange} = this.props
    return (
      <Container maxWidth="sm" style={{marginTop: 30}}>
        {postList.slice(0).reverse().map((a, i) => (
          <Card
            key={a.index}
            style={{
              // margin: 15,
              display: 'flex',
              backgroundColor: theme === Vars.theme.eink? 'white': '',
              border: theme === Vars.theme.eink? '2px solid black' : '',
              borderRadius: 5,
              boxShadow: 'none',
            }}
          >
            <ButtonBase
              onClick={() => {handlePostIChange(postList.length - 1 - i); handlePostChange()}}
              onMouseEnter={() => {
                if (postI !== postList.length - 1 - i) {
                  handlePostIChange(postList.length - 1 - i)
                }
              }}
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
                  <ArrowForwardIcon style={{color: postI === postList.length - 1 - i? 'black' : 'transparent'}}/>
                </div>
              )}
              <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                <Typography variant="h5">
                  {a.push_number}
                </Typography>
              </div>
              <div style={{}}>
                <div style={{paddingTop: 8, paddingBottom: 8}}>
                  <Typography variant="h5" color="textPrimary">
                    {a.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {a.author}
                  </Typography>
                </div>
              </div>
            </ButtonBase>
          </Card>
        ))}
        {theme !== Vars.theme.eink? (
          <React.Fragment>
            <KeysRight handlePostChange={handlePostChange} />
            <KeysUpDown
              postI={postI}
              artSize={postList.length}
              handlePostIChange={handlePostIChange}
            />
          </React.Fragment>
        ) : null}
      </Container>
    );
  }
}

export default Board
