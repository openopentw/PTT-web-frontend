import React, {Component} from 'react'
import {ButtonBase, Card, CircularProgress, Container, Grid, Typography} from '@material-ui/core'
import {colors} from '@material-ui/core'
import {Link} from "react-router-dom"
import matchSorter from 'match-sorter'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'

import Vars from '../vars/Vars.js'

const filterOptions = (options, inputValue) => (
  matchSorter(options, inputValue)
)

class Search extends Component {
  componentDidMount = () => {
    if (this.props.allBoard.length === 0 && !this.props.fetchingSearch) {
      this.props.fetchAllBoard()
    }
  }

  render = () => {
    const {theme} = this.props
    const filteredBoard = filterOptions(this.props.allBoard, this.props.searchValue)
    return (
      <Container maxWidth="sm" style={{marginTop: 30, marginBottom: 30}}>
        {this.props.allBoard.length === 0? (
          <div style={{textAlign: 'center'}}>
            <CircularProgress
              thickness={2}
              size={64}
            />
          </div>
        ) : (
          <React.Fragment>
            <Grid container spacing={3}>
              {filteredBoard.slice(0, 59).map((board, i) => (
                <Grid item xs={6}>
                  <Card
                    key={i}
                    style={{
                      // display: 'flex',
                      backgroundColor: theme === Vars.theme.eink? 'white': '',
                      border: theme === Vars.theme.eink? '2px solid black' : '',
                      borderRadius: 5,
                      boxShadow: 'none',
                    }}
                  >
                    <ButtonBase
                      {...theme === Vars.theme.eink? {
                        onClick: () => {this.props.history.push(`bbs/${board}`)}
                      } : {
                        component: Link,
                        to: `bbs/${board}`,
                      }}
                      onMouseEnter={() => {}}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        textAlign: 'initial',
                        width: '100%',
                        paddingTop: 5,
                        paddingBottom: 5,
                        ...(theme === Vars.theme.eink? {
                          paddingLeft: 32,
                          paddingRight: 32,
                        } : {}),
                      }}
                    >
                      {theme === Vars.theme.eink? null : (
                        <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                          <ArrowForwardIcon style={{color: false? 'black' : 'transparent'}}/>
                        </div>
                      )}
                      <div style={{}}>
                        <Typography variant="h6" color="textPrimary">
                          {board}
                        </Typography>
                      </div>
                    </ButtonBase>
                  </Card>
                </Grid>
              ))}
              {filteredBoard.length > 30 && (
                <Grid item xs={6}>
                  <Card
                    style={{
                      // display: 'flex',
                      backgroundColor: theme === Vars.theme.eink? 'white': '',
                      border: theme === Vars.theme.eink? '2px solid black' : '',
                      borderRadius: 5,
                      boxShadow: 'none',
                    }}
                  >
                    <ButtonBase
                      onMouseEnter={() => {}}
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        textAlign: 'initial',
                        width: '100%',
                        paddingTop: 5,
                        paddingBottom: 5,
                        ...(theme === Vars.theme.eink? {
                          paddingLeft: 32,
                          paddingRight: 32,
                        } : {}),
                      }}
                    >
                      {theme === Vars.theme.eink? null : (
                        <div style={{display: 'flex', alignItems: 'center', marginLeft: 10}}>
                          <ArrowForwardIcon style={{color: false? 'black' : 'transparent'}}/>
                        </div>
                      )}
                      <div style={{}}>
                        <Typography variant="h6" color="textPrimary">
                          ...more
                        </Typography>
                      </div>
                    </ButtonBase>
                  </Card>
                </Grid>
              )}
            </Grid>
          </React.Fragment>
        )}
      </Container>
    )
  }
}

export default Search
