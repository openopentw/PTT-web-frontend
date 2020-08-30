import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Link} from "react-router-dom"

import {ButtonBase, CircularProgress, Container, Card, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
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

  componentWillUnmount = () => {
    this.props.updateTop(this.state.postI)
  }

  render() {
    const {theme, postList} = this.props
    const {postI} = this.state
    const matchUrl = this.props.match.url
    return (
      <Container
        maxWidth="sm"
        style={{
          marginTop: 30,
          backgroundColor: theme === Vars.theme.eink? 'white' : colors.grey[300],
        }}
      >
        <div style={{textAlign: 'center'}}>
          <CircularProgress
            thickness={2}
            size={64}
          />
        </div>
        {!this.props.fetching && (
          <React.Fragment>
            {postList.slice(0).reverse().map((a, i) => (
              <Card
                key={postList.length - i}
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
                  {...!a.aid? {} : theme === Vars.theme.eink? {
                    onClick: () => {this.props.history.push(`${matchUrl}/${a.aid}`)}
                  } : {
                    component: Link,
                    to: `${matchUrl}/${a.aid}`,
                  }}
                  onMouseEnter={() => {
                    if (postI !== postList.length - 1 - i) {
                      this.setPostI(postList.length - 1 - i)
                    }
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    textAlign: 'initial',
                    width: '100%',
                    ...(theme === Vars.theme.eink? {
                      paddingLeft: 32,
                      paddingRight: 32,
                    } : {})
                  }}
                >
                  {theme === Vars.theme.eink? null : (
                    <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                      <ArrowForwardIcon style={{color: postI === postList.length - 1 - i? 'black' : 'transparent'}}/>
                    </div>
                  )}
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginRight: 10, width: 32}}>
                    <Typography variant="h6">
                      {a.push_number}
                    </Typography>
                  </div>
                  <div style={{}}>
                    <div style={{paddingTop: 8, paddingBottom: 8}}>
                      <Typography variant="h6" color="textPrimary" style={{fontWeight: 'normal'}}>
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
                <KeysRight handlePostChange={() => {
                  this.props.history.push(`${matchUrl}/${postList[postI].aid}`)
                }} />
                <KeysUpDown
                  postI={postI}
                  artSize={postList.length}
                  setPostI={this.setPostI}
                />
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}
      </Container>
    )
  }
}

export default withRouter(Board)
