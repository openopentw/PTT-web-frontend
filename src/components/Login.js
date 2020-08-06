import React, {Component} from 'react'
import {colors} from '@material-ui/core'
import {Helmet} from "react-helmet"

import {Button, Container, Typography, TextField} from '@material-ui/core'

import Vars from '../vars/vars.js'

const test = () => (
  <div id="test">
    <Typography variant="h3" gutterBottom>
      A: {document.body.clientHeight}
    </Typography>
    <Typography variant="h3" gutterBottom>
      A: {window.innerHeight}
    </Typography>
    <Typography variant="h3" gutterBottom>
      A: {document.documentElement.clientHeight}
    </Typography>
    <Typography variant="h3" gutterBottom>
      A: {document.body.clientHeight}
    </Typography>
  </div>
)

class Login extends Component {
  handleFormChange = (e) => {
    const {handleInputChange} = this.props
    const t = e.target
    const val = t.value
    const name = t.name
    handleInputChange(name, val)
  }

  render() {
    const {theme, handleLogin} = this.props
    return (
      <Container maxWidth="xs" style={{marginTop: 50}}>
        <Helmet>
          <style>{`body { background-color: ${theme === Vars.theme.eink? 'white' : colors.grey[100]}; }`}</style>
        </Helmet>
        <Typography variant="h2" gutterBottom>
          Login
        </Typography>
        {/* <test /> */}
        <form onSubmit={(e) => {handleLogin(); e.preventDefault()}} >
          <TextField
            label="user ID"
            name="user"
            fullWidth
            style={{margin: 5}}
            onChange={this.handleFormChange}
            autoFocus
          />
          <TextField
            label="password"
            name="pass"
            type="password"
            fullWidth
            style={{margin: 5}}
            onChange={this.handleFormChange}
          />
          <div style={{margin: 40, textAlign: 'center'}}>
            <Button type="submit" variant="contained" color="primary" >
              Login
            </Button>
          </div>
        </form>
      </Container>
    );
  }
}

export default Login
