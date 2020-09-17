import React, {Component} from 'react'
import {Container, Typography} from '@material-ui/core'

import Vars from '../vars/Vars.js'

class About extends Component {
  componentDidMount = () => {
    document.title = '關於本站 - PTT'
    this.props.updateOverlay(Vars.overlay.initial)
  }

  render() {
    return (
      <Container maxWidth="sm" style={{marginTop: 50}}>
        <Typography variant="h2" gutterBottom>
          關於本站
        </Typography>
        <Typography variant="body1">
          作者：鄭淵仁 (openopentw@gmail.com)
        </Typography>
        <Typography variant="body1">
          作者的話：你好啊，這是我寫的網頁，歡迎使用！
        </Typography>
      </Container>
    );
  }
}

export default About
