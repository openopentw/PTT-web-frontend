import React, {Component} from 'react'
import {ButtonBase, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import Linkify from 'linkifyjs/react'

import Vars from '../vars/Vars.js'

const vh = document.documentElement.clientHeight

class Paragraph extends Component {
  shouldComponentUpdate = (nextProps) => {
    return this.props.para !== nextProps.para
  }

  render() {
    const {para} = this.props
    return (
      <React.Fragment>
        <Typography variant="body2" style={this.props.style}>
          <Linkify>
            {para}
          </Linkify>
        </Typography>
        {this.props.img.img.map((url, i) => (
          <div key={i} style={{
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 16,
          }}>
            <ButtonBase
              style={{
                maxWidth: '100%',
              }}
              onClick={() => {this.props.showLightbox(this.props.img.idx + i)}}
            >
              <img src={url} alt="" style={{
                maxWidth: '100%',
                maxHeight: this.props.theme === Vars.theme.eink? 0.7 * vh : '70vh',
              }} />
            </ButtonBase>
          </div>
        ))}
      </React.Fragment>
    )
  }
}

export default Paragraph
