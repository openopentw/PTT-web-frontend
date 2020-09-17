import React, {Component} from 'react'
import {ButtonBase, Typography} from '@material-ui/core'
import Linkify from 'linkifyjs/react'

import Vars from '../vars/Vars.js'

const vh = document.documentElement.clientHeight

class Paragraph extends Component {
  shouldComponentUpdate = (nextProps) => {
    return this.props.para !== nextProps.para
  }

  render() {
    const {theme, para} = this.props
    const MyButton = theme === Vars.theme.eink? 'div' : ButtonBase
    return (
      <React.Fragment>
        <Typography variant="body1" style={this.props.style}>
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
            <MyButton
              style={{
                maxWidth: '100%',
              }}
              {...theme === Vars.theme.eink? {} : {
                onClick: () => {this.props.showLightbox(this.props.img.idx + i)}
              }}
            >
              <img src={url.length > 1? url[1] : url[0]} alt="" style={{
                maxWidth: '100%',
                maxHeight: theme === Vars.theme.eink? 0.7 * vh : '70vh',
              }} />
            </MyButton>
          </div>
        ))}
      </React.Fragment>
    )
  }
}

export default Paragraph
