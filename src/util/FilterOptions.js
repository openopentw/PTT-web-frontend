import matchSorter from 'match-sorter'

import Vars from '../vars/Vars.js'

class FilterOptions {
  constructor (options, theme, length=59) {
    this.options = options
    this.optionsLower = []
    for (let i in options) {
      this.optionsLower.push(options[i].toLowerCase())
    }
    this.theme = theme
    this.length = length
    this.last = {
      ret: [],
      retLower: [],
      filterString: '',
      end: 0,
    }
  }

  filter = (filterString) => {
    // best fuzzy-method
    if (this.theme !== Vars.theme.eink) {
      const ret = matchSorter(this.options, filterString)
      return {list: ret.slice(0, this.length), more: ret.length > this.length}
    }

    // lower computation method: only compare first characters
    const lowerFilterString = filterString.toLowerCase()
    let beg = 0
    let ret = [], retLower = []

    // if sub-string has been filtered before
    if (lowerFilterString.startsWith(this.last.filterString)) {
      beg = this.last.end
      for (let i in this.last.ret) {
        if (this.last.retLower[i].startsWith(lowerFilterString)) {
          ret.push(this.last.ret[i])
          retLower.push(this.last.retLower[i])
        }
      }
    }

    // other strings
    let end = beg
    for (; end < this.options.length && ret.length <= this.length + 1; ++end) {
      if (this.optionsLower[end].startsWith(lowerFilterString)) {
        ret.push(this.options[end])
        retLower.push(this.optionsLower[end])
      }
    }

    // update last
    this.last = {
      ret, retLower, end,
      filterString: lowerFilterString,
    }

    return {
      list: ret.slice(0, this.length),
      more: ret.length > this.length
    }
  }
}

export default FilterOptions
