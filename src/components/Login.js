import React, {Component} from 'react'
import {colors} from '@material-ui/core'
import {Helmet} from "react-helmet"

import {Button, Container, Typography, TextField} from '@material-ui/core'

import Vars from '../vars/Vars.js'

const TestInfo = (props) => (
  <div id="test-info">
    <Typography variant="h3" gutterBottom>
      A: {navigator.userAgent}
    </Typography>
    <Typography variant="h3" gutterBottom>
      B: {navigator.appCodeName}
    </Typography>
    <Typography variant="h3" gutterBottom>
      C: {navigator.platform}
    </Typography>
  </div>
)

class Login extends Component {
  componentDidMount = () => {
    this.props.updateOverlay(Vars.overlay.initial)
  }

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
          <style>{`body { background-color: ${theme === Vars.theme.eink? 'white' : colors.grey[300]}; }`}</style>
        </Helmet>
        <Typography variant="h2" gutterBottom>
          登入
        </Typography>
        {/* <TestInfo /> */}
        <form onSubmit={(e) => {handleLogin(); e.preventDefault()}} >
          <TextField
            label="帳號"
            variant="outlined"
            name="user"
            fullWidth
            style={{margin: 5}}
            onChange={this.handleFormChange}
            autoFocus
          />
          <TextField
            label="密碼"
            variant="outlined"
            name="pass"
            type="password"
            fullWidth
            style={{margin: 5}}
            onChange={this.handleFormChange}
          />
          <div style={{margin: 40, textAlign: 'center'}}>
            <Button type="submit" variant="outlined" style={{fontSize: 20}}>
              登入
            </Button>
          </div>
        </form>
      </Container>
    )
  }
}

export default Login
