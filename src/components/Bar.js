import React, {Component} from 'react'
import {withRouter} from "react-router"
import {Link} from "react-router-dom"
import {AppBar, Button, CircularProgress, IconButton, Toolbar, Tabs, Tab, TextField, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'
import {ArrowBack, Directions, ExitToApp} from '@material-ui/icons'
import Hotkeys from 'react-hot-keys'
import matchSorter from 'match-sorter'

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

const filterOptions = (options, {inputValue}) => (
  matchSorter(options, inputValue).slice(0, 30)
)

class Bar extends Component {
  state = {
    searchOpen: false,
    searchValue: null,
    searchInputValue: '',
  }

  onSearchOpen = async () => {
    this.setState({
      searchOpen: true
    })
    await this.props.fetchAllBoard()
  }

  onSearchChange = (e, value) => {
    this.setState({searchValue: value})
    if (value) {
      this.props.history.push(`${this.props.location.pathname}/${value}`)
    }
  }

  render() {
    const {overlay} = this.props
    const {pathname} = this.props.location
    return (
      <AppBar
        color="default"
        position="sticky"
        style={{ backgroundColor: this.props.theme === Vars.theme.eink? 'white' : '' }}
      >
        <Toolbar variant="dense" style={{display: 'flex', alignItems: 'center'}}>
          {overlay !== Vars.overlay.initial? (
            <React.Fragment>
              <Button
                {...this.props.theme === Vars.theme.eink? {
                  onClick: () => {this.props.history.push(this.props.back.url)}
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
                  marginRight: 16,
                  textTransform: 'none',
                }}
              >
                <ArrowBack style={{marginRight: 4}}/>
                {this.props.back.title}
              </Button>
              <KeyGoBack goBack={() => {this.props.history.push(this.props.back.url)}} />
            </React.Fragment>
          ) : null}
          <div>
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
                  <Tabs value={pathname} >
                    <Tab label="我的最愛" value="/bbs" component={Link} to="/bbs"
                      style={tabStyle(pathname === '/bbs')}
                    />
                    <Tab label="關於本站" value="/about" component={Link} to="/about"
                      style={tabStyle(pathname === '/about')}
                    />
                    <form
                      onSubmit={(e) => {e.preventDefault()}}
                      style={{display: 'flex', alignItems: 'center'}}
                    >
                      <Autocomplete
                        id="combo-box-demo"
                        options={this.props.allBoard}
                        loading={this.props.fetchingSearch}
                        loadingText={(
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <CircularProgress color="inherit" size={16} style={{marginRight: 8}} />
                            載入中…
                          </div>
                        )}
                        getOptionLabel={(option) => option}
                        style={{width: 200}}
                        open={this.searchOpen}
                        onOpen={this.onSearchOpen}
                        onClose={() => {this.setState({searchOpen: false})}}
                        size="small"
                        filterOptions={filterOptions}
                        value={this.state.searchValue}
                        onChange={this.onSearchChange}
                        inputValue={this.state.searchInputValue}
                        onInputChange={(e, input) => {this.setState({searchInputValue: input})}}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="搜尋看板"
                            variant="outlined"
                          />
                        )}
                      />
                    </form>
                  </Tabs>
                ) : overlay === Vars.overlay.board? (
                  <Typography variant="h6">
                    {this.props.board}
                  </Typography>
                ) : overlay === Vars.overlay.post? (
                  <Typography variant="h6">
                    {this.props.post.title}
                  </Typography>
                ) : (
                  <Typography variant="h6">
                    Error here
                  </Typography>
                )}
              </React.Fragment>
            )}
          </div>
          <div style={{flexGrow: 1}}>
          </div>
          {this.props.isLogin? (
            <React.Fragment>
              <Button color="inherit" onClick={this.props.handleLogout} style={{
                color: colors.grey[700],
                fontSize: 16,
                marginLeft: 16,
              }}>
                <ExitToApp style={{marginRight: 4}} />
                登出
              </Button>
            </React.Fragment>
          ) : null}
        </Toolbar>
      </AppBar>
    )
  }
}

export default withRouter(Bar)
