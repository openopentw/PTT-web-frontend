import React, {Component} from 'react'

import {ButtonBase, Card, CardContent, Container, Typography} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import Hotkeys from 'react-hot-keys'

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
    let elm = document.getElementById('board')
    const {boardFetching, handleBoardMore} = this.props
    if (!boardFetching && elm.scrollTop < 512) {
      console.log(elm.scrollTop)
      handleBoardMore()
    }
  }

  componentDidMount = () => {
    let elm = document.getElementById('board')
    elm.scrollTop = elm.scrollHeight
    elm.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount = () => {
    let elm = document.getElementById('board')
    elm.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    const {postList, postI, isView, handlePostChange, handlePostIChange} = this.props
    return (
      <Container maxWidth="sm" style={{marginTop: 30}}>
        {postList.slice(0).reverse().map((a, i) => (
          <Card
            key={a.index}
            style={{
              // margin: 15,
              display: 'flex',
              // backgroundColor: 'transparent',
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
              style={{display: 'flex',
                      justifyContent: 'flex-start',
                      textAlign: 'initial',
                      width: '100%'}}
            >
              <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                <ArrowForwardIcon style={{color: postI === postList.length - 1 - i? 'black' : 'transparent'}}/>
              </div>
              <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                <Typography variant="h5">
                  {a.push_number}
                </Typography>
              </div>
              <div style={{}}>
                <CardContent style={{paddingTop: 8, paddingBottom: 8}}>
                  <Typography variant="h5" color="textPrimary">
                    {a.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {a.author}
                  </Typography>
                </CardContent>
              </div>
            </ButtonBase>
          </Card>
        ))}
        {isView? (
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
