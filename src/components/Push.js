import React, {Component} from 'react'
import {ButtonBase, Card, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Linkify from 'linkifyjs/react'

import Vars from '../vars/Vars.js'

const vh = document.documentElement.clientHeight

class Push extends Component {
  render() {
    const {p, theme} = this.props
    // const {p} = this.props
    // const theme = Vars.theme.eink
    const MyButton = theme === Vars.theme.eink? 'div' : ButtonBase
    return (
      <Card
        style={{
          margin: 0,
          boxShadow: 'none',
          backgroundColor: theme === Vars.theme.eink? 'white' : colors.grey[200],
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
            ...theme === Vars.theme.eink? {
              display: 'inline-block',
              lineHeight: 0.1,
              fontSize: 48,
              width: 36,
            } : {
              display: 'flex',
              alignItems: 'center',
              fontSize: 24,
              width: '1.5em',
            },
          }}>
            {!p.displayAuthor? (
              null
            ) : p.type === '推'? (
              <ThumbUpIcon
                fontSize="inherit"
                style={{color: theme === Vars.theme.eink? '' : colors.green[500]}}
              />
            ) : p.type === '噓'? (
              <ThumbDownIcon
                fontSize="inherit" style={{color: theme === Vars.theme.eink? '' : colors.red[500]}}
              />
            ) : (
              <ArrowForwardIcon fontSize="inherit" />
            )}
          </div>
          <div style={{
            ...theme === Vars.theme.eink? {
              display: 'inline-block',
              width: 'calc(100% - 40px)',
            } : {
              flex: 1,
            },
          }}>
            {p.displayAuthor && (
              <Typography variant="caption" style={{color: 'dark-grey', display: 'flex'}}>
                <span style={{marginRight: 8}}><b>{p.author}</b></span>
                <span style={{marginRight: 8}}>({p.pushCnt + 1}樓)</span>
                <span style={{flex: 1}} />
                <span>
                  {p.time.split(' ').map((t, i) => (
                    <span key={i} style={{marginRight: 8}}>{t}</span>
                  ))}
                </span>
                {p.ip && (
                  <span style={{marginLeft: 8}}>
                    {p.ip}
                  </span>
                )}
              </Typography>
            )}
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
            <MyButton
              style={{
                maxWidth: '100%',
              }}
              onClick={() => {this.props.showLightbox(p.img.idx + i)}}
            >
              <img src={url.length > 1? url[1] : url[0]} alt="" style={{
                maxWidth: '100%',
                maxHeight: theme === Vars.theme.eink? 0.7 * vh : '70vh',
              }} />
            </MyButton>
          </div>
        ))}
      </Card>
    )
  }
}

export default Push
