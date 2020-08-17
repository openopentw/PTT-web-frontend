import React, {Component} from 'react'
import {Button, Container, IconButton, TextField, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {Helmet} from "react-helmet"
import {PostAdd} from '@material-ui/icons'

import Vars from '../vars/Vars.js'

const style = {
  marginTop: 30,
  marginBottom: 30,
}

class NewPost extends Component {
  state = {
    contentValue: '',
  }

  render() {
    return (
      <Container style={{marginTop: 50, marginBottom: 50, maxWidth: 11 * 80}}>
        <Helmet>
          <style>{`body { background-color: ${colors.grey[100]}; }`}</style>
        </Helmet>
        <form onSubmit={(e) => {e.preventDefault()}}>
          <div style={style}>
            <TextField
              autoFocus
              fullWidth
              label="貼文標題"
              variant="outlined"
              InputProps={{style: {fontSize: 20}}}
              InputLabelProps={{style: {fontSize: 20}}}
            />
          </div>
          <div style={style}>
            <TextField
              autoFocus
              fullWidth
              multiline
              label="貼文內容"
              variant="outlined"
              style={{}}
              InputProps={{style: {fontSize: 20, minHeight: '50vh', alignItems: 'flex-start'}}}
              InputLabelProps={{style: {fontSize: 20}}}
            />
          </div>
          <div style={{textAlign: 'center', ...style}}>
            <Button variant="outlined" style={{fontSize: 20}}>
              <PostAdd style={{marginRight: 4}} />
              發文
            </Button>
          </div>
        </form>
      </Container>
    )
  }
}

export default NewPost
