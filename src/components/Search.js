import React, {Component} from 'react'
import {withRouter} from "react-router"
import {ButtonBase, CircularProgress, Container, Grid, IconButton, TextField, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {Link} from "react-router-dom"
import {Clear} from '@material-ui/icons'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import Vars from '../vars/Vars.js'

const buttonStyle = (theme) => ({
  width: '100%',
  textAlign: 'center',
  ...(theme === Vars.theme.eink? {
    display: 'block',
    borderStyle: 'solid',
    borderColor: 'black',
    borderWidth: '1px 0 1px 0',
    borderRadius: 0,
  } : {
    display: 'flex',
    backgroundColor: colors.grey[200],
  }),
})

class Search extends Component {
  componentDidMount = async () => {
    document.title = '搜尋看板 - PTT'
    if (this.props.allBoard.length === 0 && !this.props.fetchingSearch) {
      this.props.fetchAllBoard()
    }
    let elm = this.props.theme === Vars.theme.eink? document.body : document.scrollingElement
    elm.scrollTop = 0
  }

  render = () => {
    const {theme} = this.props
    let filteredBoard = {}
    if (this.props.filterOptions !== null) {
      filteredBoard = this.props.filterOptions.filter(this.props.searchValue)
    } else if (this.props.allBoard.length !== 0) {
      filteredBoard = {list: this.props.allBoard.slice(0, 59), more: true}
    }
    const MyButton = theme === Vars.theme.eink? Link : ButtonBase
    return (
      <Container maxWidth="sm" style={{marginTop: 30, marginBottom: 30}}>
        {(theme === Vars.theme.eink || window.mobileCheck()) && (
          <form
            onSubmit={(e) => {e.preventDefault()}}
            style={{textAlign: 'center', marginBottom: 30}}
          >
            <TextField
              label="搜尋看板"
              variant="outlined"
              id="search-board"
              size="small"
              value={this.props.searchValue}
              onChange={(e) => {this.props.onSearchChange(e.target.value)}}
              onFocus={() => {this.props.history.push('/search')}}
              onBlur={() => {
                if (!this.props.searchValue) {
                  this.props.history.push('/bbs')
                }
              }}
              InputProps={{
                style: {fontSize: 20, backgroundColor: colors.grey[200]},
                endAdornment: this.props.searchValue && (
                  <IconButton size="small" onClick={() => {
                    this.props.onSearchChange('')
                    this.props.history.push('/bbs')
                  }}>
                    <Clear />
                  </IconButton>
                ),
              }}
            />
          </form>
        )}
        {this.props.allBoard.length === 0? (
          <div style={{textAlign: 'center'}}>
            <CircularProgress thickness={2} size={64} />
          </div>
        ) : (
          <React.Fragment>
            <Grid container spacing={3}>
              {filteredBoard.list.map((board, i) => (
                <Grid item xs={6} key={i}>
                  <MyButton
                    {...theme === Vars.theme.eink? {
                      class: 'button',
                    } : {
                      component: Link,
                    }}
                    to={`bbs/${board}`}
                    style={buttonStyle(theme)}
                  >
                    <Typography variant="h6" color="textPrimary" style={{margin: 10}}>
                      {board}
                    </Typography>
                  </MyButton>
                </Grid>
              ))}
              {filteredBoard.more && (
                <Grid item xs={6}>
                  <MyButton
                    style={buttonStyle(theme)}
                  >
                    <Typography variant="h6" color="textPrimary" style={{margin: 10}}>
                      ...more
                    </Typography>
                  </MyButton>
                </Grid>
              )}
            </Grid>
          </React.Fragment>
        )}
      </Container>
    )
  }
}

export default withRouter(Search)
