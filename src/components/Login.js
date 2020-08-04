import React, {Component} from 'react'
import {colors} from '@material-ui/core'
import {Helmet} from "react-helmet"

import {Button, Container, Typography, TextField} from '@material-ui/core'

class Login extends Component {
  handleFormChange = (e) => {
    const {handleInputChange} = this.props
    const t = e.target
    const val = t.value
    const name = t.name
    handleInputChange(name, val)
  }

  render() {
    const {handleLogin} = this.props
    return (
      <Container maxWidth="xs" style={{marginTop: 50}}>
        <Helmet>
          <style>{`body { background-color: ${colors.grey[100]}; }`}</style>
        </Helmet>
        <Typography variant="h2" gutterBottom>
          Login
        </Typography>
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
