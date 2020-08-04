import React, {Component} from 'react'

import {Container, Typography} from '@material-ui/core';

class About extends Component {
  render() {
    return (
      <Container style={{marginTop: 50}}>
        <Typography variant="h2" gutterBottom>
          About
        </Typography>
      </Container>
    );
  }
}

export default About
