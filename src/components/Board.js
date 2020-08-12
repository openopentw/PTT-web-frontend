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
  componentDidMount = async () => {
    const {boardTop} = this.props
    const {board} = this.props.match.params

    this.props.updateOverlay(Vars.overlay.board)
    this.props.updateBack({title: '我的最愛', url: '/bbs'})
    this.props.updateBoard(board)
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    if (boardTop.in !== board) {
      await this.props.fetchBoard(board)
    }
    elm.scrollTop = boardTop.in !== board? elm.scrollHeight : boardTop.top
  }

  componentWillUnmount = () => {
    this.props.updateTop()
  }

  render() {
    const {theme, postList, postI, handlePostIChange} = this.props
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
        {this.props.fetching? null : (
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
                  {...theme === Vars.theme.eink? {
                    onClick: () => {this.props.history.push(`${matchUrl}/${a.aid}`)}
                  } : {
                    component: Link,
                    to: `${matchUrl}/${a.aid}`,
                  }}
                  onMouseEnter={() => {
                    if (postI !== postList.length - 1 - i) {
                      handlePostIChange(postList.length - 1 - i)
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
                  <div style={{display: 'flex', alignItems: 'center', marginLeft: 10, width: 32}}>
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
                  handlePostIChange={handlePostIChange}
                />
              </React.Fragment>
            ) : null}
          </React.Fragment>
        )}
      </Container>
    );
  }
}

export default withRouter(Board)
