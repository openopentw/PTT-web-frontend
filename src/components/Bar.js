import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Link} from "react-router-dom"
import {AppBar, Button, IconButton, Toolbar, Tabs, Tab, TextField, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {ArrowBack, Clear, ExitToApp, PostAdd} from '@material-ui/icons'
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

class KeySearch extends Component {
  render() {
    return (
      <Hotkeys
        keyName="/"
        onKeyUp={() => {document.getElementById('search-board').focus()}}
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
    const {overlay, theme} = this.props
    const {pathname} = this.props.location
    const MyButton = theme === Vars.theme.eink? 'div': Button
    return (
      <AppBar
        color="default"
        position="sticky"
        style={{ backgroundColor: theme === Vars.theme.eink? 'white' : '' }}
      >
        <Toolbar variant="dense">
          <div style={{marginRight: 16}}>
            {overlay !== Vars.overlay.initial && (
              <React.Fragment>
                <MyButton
                  {...theme === Vars.theme.eink? {
                  } : {
                    component: Link,
                    to: this.props.back.url,
                  }}
                  edge="start"
                  color="inherit"
                  aria-label="back"
                  style={{
                    color: colors.grey[700],
                    fontSize: 16,
                    textTransform: 'none',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {theme === Vars.theme.eink? (
                    <Link to={this.props.back.url} style={{color: 'black', textDecoration: 'none', borderBottom: '2px solid grey'}}>
                      <ArrowBack/>
                      <span style={{marginLeft: 4}}>
                        {this.props.back.title}
                      </span>
                    </Link>
                  ) : (
                    <React.Fragment>
                      <ArrowBack/>
                      {!window.mobileCheck() && (
                        <span style={{marginLeft: 4}}>
                          {this.props.back.title}
                        </span>
                      )}
                    </React.Fragment>
                  )}
                </MyButton>
                {theme !== Vars.theme.eink && (
                  <React.Fragment>
                    <KeySearch />
                    <KeyGoBack goBack={() => {this.props.history.push(this.props.back.url)}} />
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
          {this.props.fetching? null : (
            <React.Fragment>
              {(!this.props.isLogin)? (
                <Tabs value={pathname} >
                  <Tab label="登入" value="/login" component={Link} to="/login"
                    style={tabStyle(pathname === '/login')}
                  />
                  <Tab label="關於本站" value="/about" component={Link} to="/about"
                    style={tabStyle(pathname === '/about')}
                  />
                </Tabs>
              ) : overlay === Vars.overlay.initial? (
                <div style={{display: 'flex'}}>
                  <Tabs value={pathname} >
                    <Tab label="我的最愛" value="/bbs" component={Link} to="/bbs"
                      style={tabStyle(pathname === '/bbs')}
                    />
                    <Tab label="關於本站" value="/about" component={Link} to="/about"
                      style={tabStyle(pathname === '/about')}
                    />
                  </Tabs>
                </div>
              ) : overlay === Vars.overlay.board? (
                <Typography variant="h6">
                  {this.props.board}
                </Typography>
              ) : overlay === Vars.overlay.post? (
                <Typography variant="h6" style={{overflow: 'hidden', whiteSpace: 'nowrap'}}>
                  {this.props.post.title}
                </Typography>
              ) : overlay === Vars.overlay.addPost? (
                <Typography variant="h6">
                  發表文章
                </Typography>
              ) : (
                <Typography variant="h6">
                  Error here
                </Typography>
              )}
            </React.Fragment>
          )}
          <div style={{flex: 1}}></div>
          {this.props.isLogin && overlay === Vars.overlay.initial && (
            <form
              onSubmit={(e) => {e.preventDefault()}}
              style={{display: 'flex', alignItems: 'center'}}
            >
              <TextField
                label="搜尋看板"
                variant="outlined"
                id="search-board"
                size="small"
                value={this.props.searchValue}
                style={{
                  width: theme === Vars.theme.eink? '10em' : '',
                }}
                onChange={(e) => {this.props.onSearchChange(e.target.value)}}
                onFocus={() => {this.props.history.push('/search')}}
                onBlur={() => {
                  if (!this.props.searchValue) {
                    this.props.history.push('/bbs')
                  }
                }}
                InputProps={{endAdornment: this.props.searchValue && (
                  <IconButton size="small" onClick={() => {
                    this.props.onSearchChange('')
                    this.props.history.push('/bbs')
                  }}>
                    <Clear />
                  </IconButton>
                )}}
              />
            </form>
          )}
          {overlay === Vars.overlay.board && (
            <React.Fragment>
              <Button
                {...theme === Vars.theme.eink? {
                  onClick: () => {this.props.history.push(`${pathname}/NewPost`)}
                } : {
                  component: Link,
                  to: `${pathname}/NewPost`,
                }}
                color="inherit"
                style={{
                  color: colors.grey[700],
                  fontSize: 16,
                  marginLeft: 16,
                }}
              >
                <PostAdd />
                {!window.mobileCheck() && (
                  <span style={{marginLeft: 4}} >
                    發文
                  </span>
                )}
              </Button>
            </React.Fragment>
          )}
          {this.props.isLogin && (
            <React.Fragment>
              <Button color="inherit" onClick={this.props.handleLogout} style={{
                color: colors.grey[700],
                fontSize: 16,
              }}>
                <ExitToApp />
                {!window.mobileCheck() && (
                  <span style={{marginLeft: 4}} >
                    登出
                  </span>
                )}
              </Button>
            </React.Fragment>
          )}
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Bar)
