import React, {Component} from 'react'

import {AppBar, Button, IconButton, Toolbar, Tabs, Tab, Typography} from '@material-ui/core'
import {Menu, ArrowBack, ExitToApp} from '@material-ui/icons'
import Hotkeys from 'react-hot-keys'

import Vars from '../vars/vars.js'

class Keys extends Component {
  render() {
    const {handleBack} = this.props
    return (
      <Hotkeys
        keyName="left"
        onKeyUp={handleBack}
      />
    )
  }
}

class Bar extends Component {
  render() {
    const {theme, bar, tab, boardName, post, isView, handleLogout, handleBack, handleTabChange} = this.props
    // if (theme === Vars.theme.eink) {
    //   return null
    // }
    return (
      <React.Fragment>
      <AppBar
        color="default"
        position="sticky"
        style={{
          backgroundColor: theme === Vars.theme.eink? 'white' : '',
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            style={{marginRight: 15}}
            onClick={() => {
              if (!(bar === Vars.bar.notLogin || bar === Vars.bar.lobby)) {
                handleBack()
              }
            }}
          >
            {(bar === Vars.bar.notLogin || bar === Vars.bar.lobby)? (
              <Menu />
            ) : (
              <ArrowBack />
            )}
          </IconButton>
          <div style={{flexGrow: 1}}>
            {(!(bar === Vars.bar.notLogin || bar === Vars.bar.lobby) && isView)? (
              <Keys handleBack={handleBack} />
            ) : null}
            {bar === Vars.bar.notLogin? (
              <Tabs value={tab} onChange={(e, v) => {handleTabChange(v)}}>
                <Tab label="Login" />
                <Tab label="About" />
              </Tabs>
            ) : bar === Vars.bar.lobby? (
              <Tabs value={tab} onChange={(e, v) => {handleTabChange(v)}}>
                <Tab label="Favorite" />
                <Tab label="About" />
              </Tabs>
            ) : bar === Vars.bar.board? (
              <Typography variant="h5">
                {boardName}
              </Typography>
            ) : bar === Vars.bar.article? (
              <Typography variant="h5">
                {post.title}
              </Typography>
            ) : (
              <Tabs value={tab} onChange={(e, v) => {handleTabChange(v)}}>
                <Tab label="NULL" />
              </Tabs>
            )}
          </div>
          {bar !== Vars.bar.notLogin? (
            <Button color="inherit" onClick={handleLogout}>
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

export default Bar
