import React, {Component} from 'react'

import {AppBar, Button, IconButton, Toolbar, Tabs, Tab, Typography} from '@material-ui/core'
import {Menu, ArrowBack, ExitToApp} from '@material-ui/icons'
import Hotkeys from 'react-hot-keys'

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
    const {vars, bar, tab, boardName, post, isView, handleLogout, handleBack, handleTabChange} = this.props
    return (
      <AppBar position="sticky" color="default">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            style={{marginRight: 15}}
            onClick={() => {
              if (!(bar === vars.bar.notLogin || bar === vars.bar.lobby)) {
                handleBack()
              }
            }}
          >
            {(bar === vars.bar.notLogin || bar === vars.bar.lobby)? (
              <Menu />
            ) : (
              <ArrowBack />
            )}
          </IconButton>
          <div style={{flexGrow: 1}}>
            {(!(bar === vars.bar.notLogin || bar === vars.bar.lobby) && isView)? (
              <Keys handleBack={handleBack} />
            ) : null}
            {bar === vars.bar.notLogin? (
              <Tabs value={tab} onChange={(e, v) => {handleTabChange(v)}}>
                <Tab label="Login" />
                <Tab label="About" />
              </Tabs>
            ) : bar === vars.bar.lobby? (
              <Tabs value={tab} onChange={(e, v) => {handleTabChange(v)}}>
                <Tab label="Favorite" />
                <Tab label="About" />
              </Tabs>
            ) : bar === vars.bar.board? (
              <Typography variant="h5">
                {boardName}
              </Typography>
            ) : bar === vars.bar.article? (
              <Typography variant="h5">
                {post.title}
              </Typography>
            ) : (
              <Tabs value={tab} onChange={(e, v) => {handleTabChange(v)}}>
                <Tab label="NULL" />
              </Tabs>
            )}
          </div>
          {bar !== vars.bar.notLogin? (
            <Button color="inherit" onClick={handleLogout}>
              <ExitToApp style={{marginRight: 10}} />
              Logout
            </Button>
          ) : null}
        </Toolbar>
      </AppBar>
    )
  }
}

export default Bar
