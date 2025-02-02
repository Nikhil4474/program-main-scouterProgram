const socket = io.connect('http://localhost:5500')
let match = false
let compLen = 0
let flipped = false

let canvas = {
    "blue": document.getElementById("blue-canvas"),
    "red": document.getElementById("red-canvas")
}

let image = {
    "blue": new Image(),
    "red": new Image()
}

let field = {}
let grid = {}

let scoresheet = {}

// define a collection for blue and red scouters
let blueScouters = {}
let redScouters = {}

let blueTotalScore = document.getElementById("total-blue")
let blueLinksScore = document.getElementById("links-blue")
let blueCoopScore = document.getElementById("coop-blue")
let blueRankingPoints = document.getElementById("rank-blue")

let redTotalScore = document.getElementById("total-red")
let redLinksScore = document.getElementById("links-red")
let redCoopScore = document.getElementById("coop-red")
let redRankingPoints = document.getElementById("rank-red")

let scoreboard = {
    "blue": new ScoreBoard(blueTotalScore, redTotalScore, blueTotalScore, blueLinksScore, blueCoopScore, blueRankingPoints),
    "red": new ScoreBoard(redTotalScore, blueTotalScore, redTotalScore, redLinksScore, redCoopScore, redRankingPoints)
}

let matchDropDown = document.getElementById("match")
let gameStateSlider = document.getElementById("game-state")
let gameStateLabel = document.getElementById("game-state-label")
let row = document.getElementById("row")
let panel = document.getElementById("panel")

function drawField() {
    canvas.blue.width = field.blue.width
    canvas.blue.height = field.blue.height

    canvas.red.width = field.red.width
    canvas.red.height = field.red.height

    field.blue.draw()
    field.red.draw()

    grid.blue.draw()
    grid.red.draw()
}

function scoutChange(button) {
    socket.emit('scoutChange', button.innerHTML)
}

const saveSchedule = () => {
    let table = {}
    table.blue = document.getElementById("blue-table")
    table.red = document.getElementById("red-table")

    socket.emit('saveSchedule', 'blue', parseTable(table.blue))
    socket.emit('saveSchedule', 'red', parseTable(table.red))
}

const saveMatches = () => {
    let table = {}
    table.blue = document.getElementById("blue-match-table")
    table.red = document.getElementById("red-match-table")

    socket.emit('saveMatch', parseTable(table.blue), parseTable(table.red))
}

canvas.blue.addEventListener("mousedown", function(e) {
    if (match) {
        socket.emit('drawMarker', 'blue', grid.blue.getMousePosition(e))
    } else {
        alert('please start the match before placing down markers')
    }
})

canvas.red.addEventListener("mousedown", function(e) {
    if (match) {
        socket.emit('drawMarker', 'red', grid.red.getMousePosition(e))
    } else {
        alert('please start the match before placing down markers')
    }
})

document.getElementById("match-increment").onclick = () => {
    let numVal = Number(matchDropDown.value)
    numVal += 1
    if (numVal > compLen) {
        numVal = compLen
    }
    matchDropDown.value = numVal
}

document.getElementById("match-decrement").onclick = () => {
    let numVal = Number(matchDropDown.value)
    numVal -= 1
    if (numVal <= 0) {
        numVal = 1
    }
    matchDropDown.value = numVal
}

socket.on('connect', () => {
    socket.emit('newAdmin')
})

socket.on('schedule', (blue, red) => {
    document.getElementById("blue-schedule").innerHTML = blue
    document.getElementById("red-schedule").innerHTML = red
})

socket.on('teams', (blueMatchData, redMatchData) => {
    document.getElementById("blue-match-schedule").innerHTML = blueMatchData
    document.getElementById("red-match-schedule").innerHTML = redMatchData
})

socket.on('compLength', compLength => {
    compLen = compLength
    for (let i = 1; i <= Number(compLength); i++) 
    {
        let matchOption = document.createElement("option")
        matchOption.value = i
        matchOption.innerHTML = i
        matchDropDown.appendChild(matchOption)
    }
})

socket.on('drawfield', (color, gameField, gameGrid) => 
{
    
    image[color].src = gameField.bg

    field[color] = new Field(canvas[color], image[color], gameField.width, gameField.height)
    grid[color] = new Grid(canvas[color], gameGrid.width, gameGrid.height, gameGrid.boxWidth, gameGrid.boxHeight)

    canvas[color].width = field[color].width
    canvas[color].height = field[color].height

    image[color].onload = () => 
    { 
        field[color].draw()
        grid[color].draw()
    }
})

socket.on('AssignRobot', (team) => 
{
    document.getElementById("robot-" + team.idx).innerHTML = team.teamNumber
    document.getElementById("robot-" + team.idx).style.backgroundColor = rgb(team.markerColor.red, team.markerColor.green, team.markerColor.blue)
    document.getElementById("name-" + team.idx).innerHTML = team.scout
    document.getElementById("name-" + team.idx).style.backgroundColor = rgb(team.markerColor.red, team.markerColor.green, team.markerColor.blue)

    let autonScore = document.getElementById("autonpts-robot-" + team.idx)
    let autonParking = document.getElementById("autonpark-robot-" + team.idx)
    let teleopScore = document.getElementById("teloppts-robot-" + team.idx) 
    let teleopParking = document.getElementById("teloppark-robot-" + team.idx)

    scoresheet[team.idx] = new ScoreCard(autonScore, teleopScore, autonParking, teleopParking)
})

socket.on('placeMarker', (color, marker) => {
    grid[color].placeMarker(marker.x, marker.y, marker.markerColor, marker.gameState)
})

socket.on('clear', color => {
    field[color].clear()
    field[color].draw()
    grid[color].draw()
})

socket.on('draw', (color, markers) => {
    for (let index in markers) {
        let marker = markers[index]
        grid[color].placeMarker(marker.x, marker.y, marker.markerColor, marker.gameState)
    }
})

socket.on('scoreboard', score => {
    
    if(!(JSON.stringify(score.teleopScore) === '{}'))
    {
        scoresheet[score.team.idx].renderTeleopScore(score.teleopScore.markerScore)
        scoresheet[score.team.idx].renderTeleopParkingScore(score.teleopScore.parkingScore)
    }
    if(!(JSON.stringify(score.autonScore) === '{}'))
    { 
        scoresheet[score.team.idx].renderAutonScore(score.autonScore.markerScore)
        scoresheet[score.team.idx].renderAutonParkingScore(score.autonScore.parkingScore)
    }

    scoreboard.blue.renderAllianceScore(score.totalScore.blueAllianceScore)
    scoreboard.blue.renderLinksScore(score.totalScore.blueAllianceLinks)
    scoreboard.blue.renderCoopScore(score.totalScore.blueCoopScore)
    scoreboard.blue.renderRankingPoints(score.totalScore.blueRankingPoints)

    scoreboard.red.renderAllianceScore(score.totalScore.redAllianceScore)
    scoreboard.red.renderLinksScore(score.totalScore.redAllianceLinks)
    scoreboard.red.renderCoopScore(score.totalScore.redCoopScore)
    scoreboard.red.renderRankingPoints(score.totalScore.redRankingPoints)
})

socket.on('confirm', () => {
    const response = confirm("Match " + matchDropDown.value + " was already scouted, do you want to scout it again?")
    if (response) {
        document.getElementById("start").innerText = "Start Auton"
    } else {
        document.getElementById("start").innerText = "Start Match"
    }
})

socket.on('disconnected', team => {

    document.getElementById("robot-" + team.idx).innerHTML = "-"
    document.getElementById("robot-" + team.idx).style.backgroundColor = "#ccc"
    document.getElementById("name-" + team.idx).style.backgroundColor = "#ccc"

    delete scoresheet[team.idx]

})

socket.on('returnGameState', gameState => {
    document.getElementById('game-state-label').value = gameState
})

socket.on('setScouters', (blue, red) => {
    let index = 1
    for (let scouter of blue)
    {
        document.getElementById("name-" + index).innerHTML = scouter
        index++
    }
    for (let scouter of red)
    {
        document.getElementById("name-" + index).innerHTML = scouter
        index++
    }
})

const setGame = (button) => {
    switch (button.innerText) {
        case "Start Match":
            //setGameScouters(matchDropDown.value)
            button.innerText = "Start Auton"
            socket.emit('setMatch', matchDropDown.value)
            match = true
            break
        case "Start Auton":
            button.innerText = "Start TeleOp"
            gameStateSlider.value = 1
            gameStateLabel.value = "auton"
            gameChange(gameStateSlider)
            socket.emit('start')
            break
        case "Start TeleOp":
            button.innerText = "End Match"
            gameStateSlider.value = 2
            gameStateLabel.value = "teleop"
            gameChange(gameStateSlider)
            break
        case "End Match":
            button.innerText = "Start Match"
            gameStateSlider.value = 0
            gameStateLabel.value = "pregame"
            match = false

            scoreboard.blue.clearScores()
            scoreboard.red.clearScores()

            for (let sheet in scoresheet) 
            {
                scoresheet[sheet].clearScores()
            }

            socket.emit('endMatch')
            gameChange(gameStateSlider)
            break
    }
}

const flip = () => 
{
    socket.emit('flip')
}

socket.on('restyle', (style) => 
{
    row.style.flexDirection = style.direction
    row.style.justifyContent = style.alignment

    panel.style.order = style.order
})

socket.on('rotate', (rotation) => 
{
    canvas.blue.style.transform = rotation
    canvas.red.style.transform = rotation
})

const gameChange = (slider) => {
    let gameStateButton = document.getElementById("start")

    socket.emit('gameChange', 'blue', slider.value)
    socket.emit('gameChange', 'red', slider.value)

    switch (slider.value) {
        case "0":
            gameStateButton.innerText = "Start Match"
            break
        case "1":
            gameStateButton.innerText = "Start TeleOp"
            break
        case "2":
            gameStateButton.innerText = "End Match"
            break
    }

    socket.emit('gameState', 'blue')
}

const setGameScouters = (key) =>
{
    
    let i = 1
    for(let cell of blueScouters[key])
    {
        
        document.getElementById("name-" + i).innerHTML = cell
        i++
    }
    for(let cell of redScouters[key])
    {
        
        document.getElementById("name-" + i).innerHTML = cell
        i++
    }
}