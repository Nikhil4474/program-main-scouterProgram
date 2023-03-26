const rgb = (red, green, blue) => 
{
    return "rgb(" + red + "," + green + "," + blue + ")"
}
class Field 
{
    constructor(bg, width, height) {
        this.bg = bg
        this.width = width
        this.height = height
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
    constructor(width, height, boxWidth, boxHeight) {
        this.width = width
        this.height = height
        this.boxWidth = boxWidth
        this.boxHeight = boxHeight
        this.gridWidth = (width / boxWidth)
        this.gridHeight = (height / boxHeight)
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
        this.ctx.stroke()
    }
    getMousePosition(event) {
        return {
            x: Math.floor(event.offsetX / this.boxWidth),
            y: Math.floor(event.offsetY / this.boxHeight)
        }
    }
    placeMarker(x, y, markerColor) {
        this.ctx.fillStyle = 'rgba(' + markerColor.red + ',' + markerColor.green + ',' + markerColor.blue + ',' + markerColor.alpha +')'
        //this.ctx.fillRect(x * this.boxWidth, y * this.boxHeight, this.boxWidth, this.boxHeight)
        this.ctx.beginPath()
        this.ctx.arc(x * this.boxWidth + this.boxWidth / 2, y * this.boxHeight + this.boxHeight / 2, 20, 0, 2 * Math.PI)
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
        this.rankingPoints = rankingPoints
    }
}

/*class ScoreBoard {
    constructor(allianceScoreEl, allianceLinksEl, autonScoreEl, teleopScoreEl, coopScoreEl, rankingPointsEl, telopParkingEl, autonParkingEl, totalScoreEl) 
    {
        this.allianceScoreEl = allianceScoreEl
        this.allianceLinksEl = allianceLinksEl
        this.autonScoreEl = autonScoreEl
        this.teleopScoreEl = teleopScoreEl
        this.coopScoreEl = coopScoreEl
        this.rankingPointsEl = rankingPointsEl
        this.telopParkingEl = telopParkingEl
        this.autonParkingEl = autonParkingEl
        this.totalScoreEl = totalScoreEl
        this.allianceScore = 0
        this.allianceLinks = 0
        this.autonScore = 0
        this.telopScore = 0
        this.telopParkingScore = 0
        this.autonParkingScore = 0
        this.totalScore = 0
        this.coopScore = 0
        this.rankingPoints = 0
    }
    drawAllianceScore(allianceScore) {
        this.allianceScore = allianceScore
        this.allianceScoreEl.innerHTML = this.allianceScore
    }
    drawAllianceLinks(allianceLinks) {
        this.allianceLinks = allianceLinks
        this.allianceLinksEl.innerHTML = this.allianceLinks
    }
    drawAutonScore(autonScore) {
        this.autonScore = autonScore
        this.autonScoreEl.innerHTML = this.autonScore
    }
    drawTeleopScore(telopScore) {
        this.telopScore = telopScore
        this.teleopScoreEl.innerHTML = this.telopScore
    }
    drawTeleopParkingScore(parkingScore) {
        this.telopParkingScore = parkingScore
        this.telopParkingEl.innerHTML = this.telopParkingScore
    }
    drawAutonParkingScore(parkingScore) {
        this.autonParkingScore = parkingScore
        this.autonParkingEl.innerHTML = this.autonParkingScore
    }
    drawTotalScore(totalScore) {
        this.totalScore = totalScore 
        this.totalScoreEl.innerHTML = this.totalScore
    }
    drawCoopScore(coopScore) {
        this.coopScore = coopScore
        this.coopScoreEl.innerHTML = this.coopScore
    }
    drawRankingPoints(rankingPoints) {
        this.rankingPoints = rankingPoints
        this.rankingPointsEl.innerHTML = this.rankingPoints
    }
}*/