import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Link} from "react-router-dom"

import {AppBar, Button, IconButton, Toolbar, Tabs, Tab, Typography} from '@material-ui/core'
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

class Bar extends Component {
  render() {
    const {pathname} = this.props.location
    const pathLevel = pathname.split('/').length
    return (
      <React.Fragment>
      <AppBar
        color="default"
        position="sticky"
        style={{
          backgroundColor: this.props.theme === Vars.theme.eink? 'white' : '',
        }}
      >
        <Toolbar>
          {pathLevel > 2? (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              style={{marginRight: 15}}
              onClick={this.props.history.goBack}
            >
              <ArrowBack />
            </IconButton>
          ) : null}
          <div style={{flexGrow: 1}}>
            {pathLevel > 2? (
              <KeyGoBack goBack={this.props.history.goBack} />
            ) : null}
            {(!this.props.isLogin)? (
              <Tabs value={pathname} >
                <Tab label="Login" value="/login" component={Link} to="/login" />
                <Tab label="About" value="/about" component={Link} to="/about" />
              </Tabs>
            ) : pathLevel === 4? (
              <Typography variant="h5">
                {this.props.post.title}
              </Typography>
            ) : pathLevel === 3? (
              <Typography variant="h5">
                {this.props.boardName}
              </Typography>
            ) : pathLevel === 2? (
              <Tabs value={pathname} >
                <Tab label="Favorite" value="/bbs" component={Link} to="/bbs" />
                <Tab label="About" value="/about" component={Link} to="/about" />
              </Tabs>
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
      </React.Fragment>
    )
  }
}

export default withRouter(Bar)
