const socket = io.connect('http://localhost:5500');

let clientBalls = {}
let scoutData = {}

let blueAllianceScore = document.getElementById("B-point")
let redAllianceScore = document.getElementById("A-point")

let autonScore = document.getElementById("auton")
let teleopScore = document.getElementById("telop")
let totalScore = document.getElementById("total")
let linksScore = document.getElementById("links")
let coopScore = document.getElementById("co-op")
let rankingPoints = document.getElementById("ranking-points")
let teleopParking = document.getElementById("telopParking")
let autonParking = document.getElementById("autonParking")

function gameChange() {
    socket.emit('gameChange')
}

socket.on('connect', () => {
    socket.emit('newScouter')
})

socket.on('AssignRobot', (team) => {
    if(!Object.keys(scoutData).length)
    {
        scoutData = team;
    }
    document.getElementById("number-display").style.backgroundColor = rgb(team.markerColor.red, team.markerColor.green, team.markerColor.blue)
    document.getElementById("team-number").textContent = team.teamNumber
})

socket.on('placeMarker', marker => {
    grid.placeMarker(marker.x, marker.y, marker.markerColor)
})

socket.on('redraw', (telopMarkers, autonMarkers) => {
    field.clear()
    field.draw()
    grid.draw()
    
    console.log("teleop markers: ")
    for (let marker in telopMarkers) {
        console.log(telopMarkers[marker])
        grid.placeMarker(telopMarkers[marker].x, telopMarkers[marker].y, telopMarkers[marker].markerColor)
    }
    console.log("auton markers: ")
    for (let marker in autonMarkers) {
        console.log(autonMarkers[marker])
        grid.placeMarker(autonMarkers[marker].x, autonMarkers[marker].y, autonMarkers[marker].markerColor)
    }
})

socket.on('clear', () => {
    field.clear()
    field.draw()
    grid.draw()
})

socket.on('draw', markers => {
    for (let index in markers) {
        let marker = markers[index]
        grid.placeMarker(marker.x, marker.y, marker.markerColor)
    }
})

socket.on('gameOver', () => {
    //console.log('game has ended')
    document.getElementById("session-handler").submit()
})

/*socket.on('toggleGameMode', () => {
    document.getElementById('gamestate').checked = ''
})*/

socket.on('getRobot', robots => {})