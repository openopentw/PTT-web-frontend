import React, {Component} from 'react'
import {Button, IconButton, TextField, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {ArrowForward, Send, FindInPage, ThumbDown, ThumbUp, Reply as ReplyIcon} from '@material-ui/icons'

import Vars from '../vars/Vars.js'

class Reply extends Component {
  state = {
    pushValue: '',
  }

  addPush = async (type) => {
    await this.props.addPush(type, this.state.pushValue)
    this.setState({pushValue: ''})
    await this.props.fetchPost(true)
  }

  render() {
    const {para} = this.props
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
              endAdornment: this.state.pushValue && (
                <React.Fragment>
                  <IconButton onClick={() => {this.addPush('推')}}>
                    <ThumbUp style={{color: colors.green[500]}} />
                  </IconButton>
                  <IconButton onClick={() => {this.addPush('→')}}>
                    <ArrowForward/>
                  </IconButton>
                  <IconButton onClick={() => {this.addPush('噓')}}>
                    <ThumbDown style={{color: colors.red[500]}} />
                  </IconButton>
                </React.Fragment>
              ),
            }}
            InputLabelProps={{style: {fontSize: 20}}}
          />
        </form>
        <div>
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
        </div>
        <div>
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
        </div>
      </div>
    )
  }
}

export default Reply
