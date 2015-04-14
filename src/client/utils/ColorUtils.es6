const _primaryColors = ["rgb(96, 125, 139)", "rgb(158, 158, 158)", "rgb(121, 85, 72)", "rgb(255, 87, 34)", "rgb(255, 152, 0)", "rgb(255, 193, 7)", "rgb(255, 235, 59)", "rgb(205, 220, 57)", "rgb(139, 195, 74)", "rgb(76, 175, 80)", "rgb(0, 150, 136)", "rgb(0, 188, 212)", "rgb(3, 169, 244)", "rgb(33, 150, 243)", "rgb(63, 81, 181)", "rgb(103, 58, 183)", "rgb(156, 39, 176)", "rgb(233, 30, 99)", "rgb(244, 67, 54)"]
const _secondaryColors = ["rgb(239, 154, 154)", "rgb(244, 143, 177)", "rgb(206, 147, 216)", "rgb(179, 157, 219)", "rgb(159, 168, 218)", "rgb(144, 202, 249)", "rgb(129, 212, 250)", "rgb(128, 222, 234)", "rgb(128, 203, 196)", "rgb(165, 214, 167)", "rgb(197, 225, 165)", "rgb(230, 238, 156)", "rgb(255, 245, 157)", "rgb(255, 224, 130)", "rgb(255, 204, 128)", "rgb(255, 171, 145)", "rgb(188, 170, 164)", "rgb(238, 238, 238)", "rgb(176, 190, 197)"]
const _tertiaryColors = ["rgb(198, 40, 40)", "rgb(173, 20, 87)", "rgb(106, 27, 154)", "rgb(69, 39, 160)", "rgb(40, 53, 147)", "rgb(21, 101, 192)", "rgb(2, 119, 189)", "rgb(0, 131, 143)", "rgb(0, 105, 92)", "rgb(46, 125, 50)", "rgb(85, 139, 47)", "rgb(158, 157, 36)", "rgb(249, 168, 37)", "rgb(255, 143, 0)", "rgb(239, 108, 0)", "rgb(216, 67, 21)", "rgb(78, 52, 46)", "rgb(66, 66, 66)", "rgb(55, 71, 79)"]

module.exports = {
  uniqueColorGenerator(){
    class ColorGenerator {
      constructor(){
        this.availableColors = []
        this.assignedColors = {}
        this._refreshColors()
      }

      colorForId(id) {
        if(!this.assignedColors[id]) {
          if(this.availableColors.length === 0) {
            // re-add all colors if we run out of colors to give out.
            this._refreshColors()
          }
          this.assignedColors[id] = this.availableColors.pop()
        }
        return this.assignedColors[id]
      }

      _refreshColors(){
        this.availableColors = this.availableColors.concat(_tertiaryColors).concat(_secondaryColors).concat(_primaryColors)
      }
    }
    return new ColorGenerator()
  }
}
