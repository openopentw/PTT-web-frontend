import React, {Component} from 'react'
import {ButtonBase, Card, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Linkify from 'linkifyjs/react'

import Vars from '../vars/Vars.js'

const imgReg = /(https?:\/\/.*\.(?:png|jpeg|gif|jpg))/gi
const imgurReg = /(https?:\/\/?(m\.)imgur\.com\/.......)(?!\.(png|jpeg|gif|jpg))/gi

const vh = document.documentElement.clientHeight

class Push extends Component {
  render() {
    const {p, theme, displayAuthor} = this.props
    return (
      <Card
        style={{
          margin: 0,
          boxShadow: 'none',
        }}
      >
        <div
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            display: 'flex',
            width: '100%'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '2em',
          }}>
            {!displayAuthor? (
              null
            ) : p.type === '推'? (
              <ThumbUpIcon fontSize="small" style={{color: colors.green[500]}} />
            ) : p.type === '噓'? (
              <ThumbDownIcon fontSize="small" style={{color: colors.red[500]}} />
            ) : (
              <ArrowForwardIcon/>
            )}
          </div>
          <div style={{flex: 1}}>
            {displayAuthor? (
              <Typography variant="caption" style={{color: 'dark-grey', display: 'flex'}}>
                <span style={{flex: 1}}>
                  {p.author}
                </span>
                <span>
                  {p.time}
                </span>
                {p.ip && (
                  <span style={{marginLeft: 8}}>
                    {p.ip}
                  </span>
                )}
              </Typography>
            ) : null}
            <Typography variant="body1" style={{
              color: theme === Vars.theme.eink? colors.grey[900] : '#A78430',
              flex: 1,
              ...this.props.style,
            }}>
              <Linkify>
                {p.content}
              </Linkify>
            </Typography>
          </div>
        </div>
        {p.img.img.map((url, i) => (
          <div key={i} style={{
            textAlign: 'center',
            marginTop: 16,
            marginBottom: 16,
          }}>
            <ButtonBase
              style={{
                maxWidth: '100%',
              }}
              onClick={() => {this.props.showLightbox(p.img.idx + i)}}
            >
              <img src={url} alt="" style={{
                maxWidth: '100%',
                maxHeight: this.props.theme === Vars.theme.eink? 0.7 * vh : '70vh',
              }} />
            </ButtonBase>
          </div>
        ))}
      </Card>
    )
  }
}

export default Push
