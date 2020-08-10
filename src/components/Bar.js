import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Link} from "react-router-dom"

import {AppBar, Button, IconButton, Toolbar, Tabs, Tab, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {Menu, ArrowBack, ExitToApp} from '@material-ui/icons'
import Hotkeys from 'react-hot-keys'

import Vars from '../vars/Vars.js'

class KeyGoBack extends Component {
  render() {
    return (
      <Hotkeys
        keyName="left"
        onKeyUp={this.props.goBack}
      />
    )
  }
}

const tabStyle = (focus) => ({
  // padding: 0,
  fontSize: 16,
  ...(focus? {
    fontWeight: 'bold',
    // backgroundColor: colors.grey[300],
  } : {}),
})

class Bar extends Component {
  render() {
    const {overlay} = this.props
    const {pathname} = this.props.location
    const isEink = this.props.theme === Vars.theme.eink
    return (
      <AppBar
        color="default"
        position="sticky"
        style={{ backgroundColor: isEink? 'white' : '' }}
      >
        <Toolbar variant="dense" style={{
          // ...(isEink? {
          // } : {}),
        }}>
          {overlay !== Vars.overlay.initial? (
            <React.Fragment>
              <IconButton
                component={Link}
                to={this.props.backUrl}
                edge="start"
                color="inherit"
                aria-label="back"
                style={{marginRight: 15}}
              >
                <ArrowBack />
              </IconButton>
              <KeyGoBack goBack={() => {this.props.history.push(this.props.backUrl)}} />
            </React.Fragment>
          ) : null}
          <div style={{flexGrow: 1}}>
            {(!this.props.isLogin)? (
              <Tabs value={pathname} >
                <Tab label="Login" value="/login" component={Link} to="/login"
                  style={tabStyle(pathname === '/login')}
                />
                <Tab label="About" value="/about" component={Link} to="/about"
                  style={tabStyle(pathname === '/about')}
                />
              </Tabs>
            ) : overlay === Vars.overlay.initial? (
              <Tabs
                value={pathname}
              >
                <Tab label="Favorite" value="/bbs" component={Link} to="/bbs"
                  style={tabStyle(pathname === '/bbs')}
                />
                <Tab label="About" value="/about" component={Link} to="/about"
                  style={tabStyle(pathname === '/about')}
                />
              </Tabs>
            ) : overlay === Vars.overlay.board? (
              <Typography variant="h6">
                {this.props.boardName}
              </Typography>
            ) : overlay === Vars.overlay.post? (
              <Typography variant="h6">
                {this.props.post.title}
              </Typography>
            ) : (
              <div>40444</div>
            )}
          </div>
          {this.props.isLogin? (
            <Button color="inherit" onClick={this.props.handleLogout}>
              <ExitToApp style={{marginRight: 10}} />
              Logout
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Bar)
