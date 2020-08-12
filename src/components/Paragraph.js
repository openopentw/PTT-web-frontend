import React, {Component} from 'react'
import {ButtonBase, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import Linkify from 'linkifyjs/react'

import matchAll from '../util/matchAll.js'
import Vars from '../vars/Vars.js'

const imgReg = /(https?:\/\/.*\.(?:png|jpeg|gif|jpg))/gi
const imgurReg = /(https?:\/\/imgur\.com\/.......)(?!\.(png|jpeg|gif|jpg))/gi

const vh = document.documentElement.clientHeight

class Paragraph extends Component {
  shouldComponentUpdate = (nextProps) => {
    return this.props.para !== nextProps.para
  }

  render() {
    const {para} = this.props
    const matches = [
      // ...[...para.matchAll(imgReg)].map(url => url[0]),
      // ...[...para.matchAll(imgurReg)].map(url => `${url[0]}.jpg`),
      ...[...matchAll(imgReg, para)].map(url => url[0]),
      ...[...matchAll(imgurReg, para)].map(url => `${url[0]}.jpg`),
    ]
    // if (matches.length > 0) {
    //   this.props.setPostImg(true, this.props.ParaI, matches)
    // }
    return (
      <React.Fragment>
        <Typography variant="body1" style={this.props.style}>
          <Linkify>
            {para}
          </Linkify>
        </Typography>
        {this.props.postImg.matches.map((url, i) => (
          <div key={i} style={{
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 16,
          }}>
            <ButtonBase
              style={{
                maxWidth: '100%',
              }}
              onClick={() => {this.props.showLightbox(this.props.postImg.idx + i)}}
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
