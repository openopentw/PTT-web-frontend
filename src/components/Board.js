import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Helmet} from "react-helmet"
import {Link} from "react-router-dom"

import {ButtonBase, CircularProgress, Container, Paper, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import {PostAdd} from '@material-ui/icons'
import Hotkeys from 'react-hot-keys'

import Vars from '../vars/Vars.js'

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
    const {postI, artSize, setPostI} = this.props
    if (keyName === 'down') {
      if (postI > 0) {
        setPostI(postI - 1)
      }
    } else if (keyName === 'up') {
      if (postI < artSize - 1) {
        setPostI(postI + 1)
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
  state = {
    postI: 0,
  }

  setPostI = (postI) => {
    this.setState({postI})
  }

  componentDidMount = async () => {
    const {boardTop} = this.props
    const {board} = this.props.match.params

    if (board !== undefined) {
      document.title = `${board} - PTT`
    }
    this.props.updateOverlay(Vars.overlay.board)
    this.props.updateBack({title: '我的最愛', url: '/bbs'})
    this.props.updateBoard(board)
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    if (boardTop.in !== board) {
      await this.props.fetchBoard(board)
    } else {
      this.setPostI(boardTop.postI)
    }
    elm.scrollTop = boardTop.in !== board? elm.scrollHeight : boardTop.top
  }

  getSnapshotBeforeUpdate = (prevProps, prevState) => {
    const {boardRangeBeg, postList, fetching} = prevProps
    if (!fetching && postList.length > 0 &&
        (boardRangeBeg !== this.props.boardRangeBeg || postList.length !== this.props.postList.length)) {
      const boardRangeLast = Math.min(boardRangeBeg + 3 * Vars.boardRange, postList.length) - 1
      let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
      return {
        scrollTop: elm.scrollTop,
        first: {
          boardIdx: boardRangeBeg,
          offsetTop: document.getElementById(`board-${boardRangeBeg}`).offsetTop,
        },
        last: {
          boardIdx: boardRangeLast,
          offsetTop: document.getElementById(`board-${boardRangeLast}`).offsetTop,
        }
      }
    }
    return null
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    if (snapshot !== null) {
      // console.log(snapshot)
      const {boardRangeBeg} = this.props
      let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
      // console.log(elm.scrollTop)
      if (prevProps.boardRangeBeg > boardRangeBeg) { // scroll down
        let toScroll= snapshot.first.offsetTop - document.getElementById(`board-${snapshot.first.boardIdx}`).offsetTop
        // console.log(toScroll)
        if (Math.abs(snapshot.scrollTop - elm.scrollTop - toScroll) > 5) { // browser has scrolled automatically
          elm.scrollTop -= toScroll
        }
      } else if (prevProps.boardRangeBeg < boardRangeBeg) { // scroll up
        let toScroll= snapshot.last.offsetTop - document.getElementById(`board-${snapshot.last.boardIdx}`).offsetTop
        // console.log(toScroll)
        if (Math.abs(snapshot.scrollTop - elm.scrollTop - toScroll) > 5) { // browser has scrolled automatically
          elm.scrollTop -= toScroll
        }
      } else { // no scroll, but append more
        let toScroll= snapshot.last.offsetTop - document.getElementById(`board-${snapshot.last.boardIdx}`).offsetTop
        if (Math.abs(snapshot.scrollTop - elm.scrollTop - toScroll) > 5) { // browser has scrolled automatically
          elm.scrollTop -= toScroll
        }
      }
    }
  }

  componentWillUnmount = () => {
    this.props.updateTop(this.state.postI)
  }

  render() {
    const {theme, postList, boardRangeBeg} = this.props
    const {postI} = this.state
    const matchUrl = this.props.match.url
    const MyButton = theme === Vars.theme.eink? Link : ButtonBase
    const boardLen = Math.min(boardRangeBeg + 3 * Vars.boardRange, postList.length)
    return (
      <Container maxWidth="sm" style={{ marginTop: 30, marginBottom: 30 }} >
        <Helmet>
          <style>{`body { background-color: ${theme === Vars.theme.eink? 'white' : colors.grey[300]}; }`}</style>
        </Helmet>
        <div style={{textAlign: 'center'}}>
          <CircularProgress
            thickness={2}
            size={64}
          />
        </div>
        {!this.props.fetching && (
          <React.Fragment>
            {postList.slice(
              boardRangeBeg, Math.min(boardRangeBeg + 3 * Vars.boardRange, postList.length)
            ).reverse().map((a, i) => (
              <div key={boardLen - i - 1} id={`board-${boardLen - i - 1}`} >
                <MyButton
                  {...theme !== Vars.theme.eink? {
                    component: Link,
                  } : {
                    class: 'button',
                  }}
                  to={`${matchUrl}/${a.aid}`}
                  onMouseEnter={() => {
                    if (theme !== Vars.theme.eink && postI !== boardLen - i - 1) {
                      this.setPostI(boardLen - i - 1)
                    }
                  }}
                  style={{
                    width: '100%',
                    pointerEvents: a.aid === null? 'none' : '',
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
                  }}
                >
                  {theme !== Vars.theme.eink && !window.mobileCheck() && (
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                      <ArrowForwardIcon style={{color: postI === boardLen - i - 1? 'black' : 'transparent'}}/>
                    </div>
                  )}
                  <div style={{
                    ...theme === Vars.theme.eink? {
                      display: 'inline-block',
                    } : {
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    },
                    textAlign: 'center', marginLeft: 10, marginRight: 10, width: 32,
                  }}>
                    <Typography variant="h6">
                      {a.push_number}
                    </Typography>
                  </div>
                  <div style={{
                    ...theme === Vars.theme.eink? {
                      display: 'inline-block',
                      width: 'calc(90% - 32px)',
                    } : {
                    },
                  }}>
                    <div style={{paddingTop: 8, paddingBottom: 8}}>
                      <Typography variant="h6" color="textPrimary" style={{fontWeight: 'normal'}}>
                        {a.title}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {a.aid === null && '(本文已被刪除) '}{a.author}
                      </Typography>
                    </div>
                  </div>
                </MyButton>
              </div>
            ))}
            {theme === Vars.theme.eink && (
              <div style={{borderTop: '1px solid black'}}/>
            )}
            {theme === Vars.theme.eink && (
              <div style={{
                marginTop: 32,
                textAlign: 'center',
              }} >
                {/*
                <Link
                  to={`/bbs/${this.props.match.params.board}/NewPost`}
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
                  發文
                </Link>
                */}
              </div>
            )}
            {theme !== Vars.theme.eink && !window.mobileCheck() && (
              <React.Fragment>
                <KeysRight handlePostChange={() => {
                  if (postList[postI].aid !== null) {
                    this.props.history.push(`${matchUrl}/${postList[postI].aid}`)
                  }
                }} />
                <KeysUpDown
                  postI={postI}
                  artSize={postList.length}
                  setPostI={this.setPostI}
                />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Container>
    )
  }
}

export default withRouter(Board)
