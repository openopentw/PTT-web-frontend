class Util {
  test = () => {
    console.log('hi')
  }

  matchAll = (pattern, haystack) => {
    var regex = new RegExp(pattern,"g")
    var matches = []

    var match_result = haystack.match(regex)

    for (let index in match_result){
      var item = match_result[index]
      matches[index] = item.match(new RegExp(pattern))
    }
    return matches
  }
}
export default Util
