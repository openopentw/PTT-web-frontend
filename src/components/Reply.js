import React, {Component} from 'react'
import {Button, IconButton, TextField} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {ArrowForward, FindInPage, ThumbDown, ThumbUp, Reply as ReplyIcon} from '@material-ui/icons'

import Vars from '../vars/Vars.js'

const iconStyle = (theme) => (
  theme === Vars.theme.eink? {
    fontSize: 48,
    lineHeight: 0.1,
  } : {
    fontSize: 24,
  }
)

class Reply extends Component {
  state = {
    pushValue: '',
  }

  addPush = async (type) => {
    if (this.state.pushValue !== '') {
      await this.props.addPush(type, this.state.pushValue)
      this.setState({pushValue: ''})
      await this.props.fetchPost(true)
    }
  }

  render() {
    const {theme} = this.props
    return (
      <div style={{
        display: 'flex',
        paddingTop: 20,
        paddingBottom: 20,
      }}>
        <form
          onSubmit={(e) => {e.preventDefault()}}
          style={{flex: 1, display: 'flex', alignItems: 'center'}}
        >
          <TextField
            multiline
            label="推噓文"
            value={this.state.pushValue}
            onChange={(e) => {this.setState({pushValue: e.target.value})}}
            size="small"
            style={{width: '100%'}}
            variant="outlined"
            InputProps={{
              style: {fontSize: 20},
              endAdornment: (
                <React.Fragment>
                  <IconButton style={iconStyle(theme)} size="small" onClick={() => {this.addPush('推')}}>
                    <ThumbUp fontSize="inherit" style={{color: colors.green[500]}} />
                  </IconButton>
                  <IconButton style={iconStyle(theme)} size="small" onClick={() => {this.addPush('→')}}>
                    <ArrowForward fontSize="inherit" />
                  </IconButton>
                  <IconButton style={iconStyle(theme)} size="small" onClick={() => {this.addPush('噓')}}>
                    <ThumbDown fontSize="inherit" style={{color: colors.red[500]}} />
                  </IconButton>
                </React.Fragment>
              ),
            }}
            InputLabelProps={{style: {fontSize: 20}}}
          />
        </form>
        {/*<div>
          <Button
            edge="start"
            color="inherit"
            style={{
              color: colors.grey[700],
              fontSize: 20,
              // marginRight: 16,
            }}
          >
            <ReplyIcon style={{marginRight: 4}}/>
            回文
          </Button>
          <Button
            edge="start"
            color="inherit"
            style={{
              color: colors.grey[700],
              fontSize: 20,
              // marginRight: 16,
            }}
          >
            <FindInPage style={{marginRight: 4}}/>
            搜尋相關
          </Button>
        </div>*/}
      </div>
    )
  }
}

export default Reply
