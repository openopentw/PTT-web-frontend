import React, {Component} from 'react'
import {ButtonBase, Card, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown';

class Push extends Component {
  render() {
    const {p, displayAuthor} = this.props
    return (
      <Card
        style={{
          margin: 0,
          // display: 'flex',
          // backgroundColor: 'transparent',
          boxShadow: 'none',
        }}
      >
        <ButtonBase
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            display: 'flex',
            justifyContent: 'flex-start',
            textAlign: 'initial',
            width: '100%'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            width: '2em',
            // marginRight: 10,
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
          <div style={{flexGrow: 1}}>
            {displayAuthor? (
              <Typography variant="caption" style={{color: 'dark-grey', display: 'flex'}}>
                <div style={{flexGrow: 1}}>
                  {p.author}
                </div>
                <div>
                  {p.time}
                </div>
              </Typography>
            ) : null}
            <Typography style={{fontSize: 20, color: '#A78430'}}>
              {p.content}
            </Typography>
          </div>
        </ButtonBase>
      </Card>
    )
  }
}

export default Push
