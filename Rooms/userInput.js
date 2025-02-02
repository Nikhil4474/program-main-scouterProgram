const rgb = (red, green, blue) => 
{
    return "rgb(" + red + "," + green + "," + blue + ")"
}

const parseTable = (table) => 
{
    let data = {}
    for (let row = 1; row < table.rows.length; row++)
    {
        data[row] = []
        let record = table.rows[(row - 1)]
        for (let cell = 1; cell < record.cells.length; cell++)
        {
            data[row].push(record.cells[cell].getElementsByTagName('input')[0].value)
        }
    }
    return data
}
class Field 
{
    constructor(canvas, bg, width, height) {
        this.canvas = canvas
        this.bg = bg
        this.width = width
        this.height = height
        this.ctx = this.canvas.getContext('2d')
    }
    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
    draw() {
        this.ctx.drawImage(this.bg, 0, 0, this.width, this.height)
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height)
    }
}
class Grid 
{
    constructor(canvas, width, height, boxWidth, boxHeight) {
        this.canvas = canvas
        this.width = width
        this.height = height
        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
        this.gridWidth = (width / boxWidth)
        this.gridHeight = (height / boxHeight)
        this.ctx = this.canvas.getContext('2d')
    }
    setCanvas(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
    }
    draw() {
        this.ctx.beginPath()
        for (let x = 1; x < this.gridWidth; x++) {
            this.ctx.moveTo(x * this.boxWidth, 0)
            this.ctx.lineTo(x * this.boxWidth, this.height)
        }
        for (let y = 1; y < this.gridHeight; y++) {
            this.ctx.moveTo(0, y * this.boxHeight)
            this.ctx.lineTo(this.width, y * this.boxHeight)
        }
        this.ctx.strokeStyle = `rgb(192,192,192)`;
        this.ctx.stroke()
    }
    getMousePosition(event) {
        return {
            x: Math.floor(event.offsetX / this.boxWidth),
            y: Math.floor(event.offsetY / this.boxHeight)
        }
    }
    placeMarker(x, y, markerColor, gameState) {
        this.ctx.fillStyle = 'rgba(' + markerColor.red + ',' + markerColor.green + ',' + markerColor.blue + ',' + markerColor.alpha +')'
        if (gameState == "auton") 
        {
            this.ctx.fillRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight)
        } 
        else if (gameState == "teleop")
        {
            this.ctx.beginPath()
            this.ctx.arc(x * this.boxWidth + this.boxWidth / 2, y * this.boxHeight + this.boxHeight / 2, 10, 0, 2 * Math.PI)
        }
        this.ctx.fill()
    }
    placeIndicator(x, y, allianceColor) {
        this.ctx.fillStyle = allianceColor
        this.ctx.beginPath()
        this.ctx.arc(x * this.boxWidth + this.boxWidth/2, y * this.boxHeight + this.boxHeight / 2, 2, 0, 2 * Math.PI)
        this.ctx.fill()
    }
    drawLink(x, y) {
        this.ctx.strokeRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight * 3)
    }
}

class ScoreCard 
{
    constructor(autonScore, teleopScore, autonParkingScore, teleopParkingScore)
    {
        this.autonScore = autonScore
        this.teleopScore = teleopScore
        this.autonParkingScore = autonParkingScore
        this.teleopParkingScore = teleopParkingScore
    }

    renderAutonScore(autonScore)
    {
        this.autonScore.innerHTML = autonScore
    }

    renderTeleopScore(teleopScore)
    {
        this.teleopScore.innerHTML = teleopScore
    }

    renderAutonParkingScore(autonParkingScore)
    {
        this.autonParkingScore.innerHTML = autonParkingScore
    }

    renderTeleopParkingScore(teleopParkingScore)
    {
        this.teleopParkingScore.innerHTML = teleopParkingScore
    }

    clearScores()
    {
        this.autonScore.innerHTML = "0"
        this.teleopScore.innerHTML = "0"
        this.autonParkingScore.innerHTML = "0"
        this.teleopParkingScore.innerHTML = "0"
    }
}

class ScoreBoard
{
    constructor(allianceScore, opposingScore, totalScore, linksScore, coopScore, rankingPoints)
    {
        this.allianceScore = allianceScore
        this.opposingScore = opposingScore
        this.totalScore = totalScore
        this.linksScore = linksScore
        this.coopScore = coopScore
        this.rankingPoints = rankingPoints
    }

    renderAllianceScore(allianceScore)
    {
        this.allianceScore.innerHTML = allianceScore
    }

    renderOpposingScore(opposingScore)
    {
        this.opposingScore.innerHTML = opposingScore
    }

    renderTotalScore(totalScore)
    {
        this.totalScore.innerHTML = totalScore
    }

    renderLinksScore(linksScore)
    {
        this.linksScore.innerHTML = linksScore
    }

    renderCoopScore(coopScore)
    {
        this.coopScore.innerHTML = coopScore
    }

    renderRankingPoints(rankingPoints)
    {
        this.rankingPoints.innerHTML = rankingPoints
    }

    clearScores()
    {
        this.allianceScore.innerHTML = "0"
        this.opposingScore.innerHTML = "0"
        this.totalScore.innerHTML = "0"
        this.linksScore.innerHTML = "0"
        this.coopScore.innerHTML = "0"
        this.rankingPoints.innerHTML = "0"
    }
}