import 'phaser';

var config = {
    backgroundColor: 0xffffff,
    width: 800,
    height: 640,
    physics: {
        default: 'arcade'
    },
    type: Phaser.AUTO,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var diseaseSpeed = 2000;
var showPaths = true;

// Node positions
var startPos = 50;
var horizontalGap = 200;
var verticalGap = 200;

var nodeArray = [
    [startPos, startPos],                                       //A0
    [startPos + horizontalGap, startPos],                       //B1
    [startPos + (horizontalGap*2), startPos + (verticalGap/2)], //C2
    [startPos, startPos + verticalGap],                         //D3
    [startPos + horizontalGap,startPos + verticalGap],          //E4
    [startPos + (horizontalGap*2), startPos + verticalGap + (verticalGap/2)],  //F5
    [startPos,startPos+(verticalGap*2)],                        //G6
    [startPos + horizontalGap,startPos+(verticalGap*2)]         //H7
];

// edge points (connections between nodes, referenced by node indexes)
var edgesArray = [
    [0,1],  //1
    [0,3],  //2
    [3,1],  //3
    [1,4],  //4
    [1,2],  //5
    [4,2],  //6
    [3,4],  //7
    [3,6],  //8
    [6,4],  //9
    [4,7],  //10
    [4,5],  //11
    [2,5],  //12
    [6,7],  //13
    [7,5],  //14
];

function preload ()
{
    this.load.image('cow', 'assets/cow.png');
    this.load.image('disease', 'assets/virus-small.png');
}

function create ()
{
    //TODO: make this more readable :/
    //create edges between nodes (both directions)
    var paths = [];
    var path, edgeArray;
    for(i=0; i<edgesArray.length; i++)
    {
        edgeArray = edgesArray[i];
        path = new Phaser.Curves.Path(nodeArray[edgeArray[0]][0], nodeArray[edgeArray[0]][1]);
        path.lineTo(nodeArray[edgeArray[1]][0], nodeArray[edgeArray[1]][1]);
        paths.push(path);
        
        path = new Phaser.Curves.Path(nodeArray[edgeArray[1]][0], nodeArray[edgeArray[1]][1]);
        path.lineTo(nodeArray[edgeArray[0]][0], nodeArray[edgeArray[0]][1]);
        paths.push(path);
    }

    if(showPaths)
    {
        var graphics = this.add.graphics();
        graphics.lineStyle(1, 0x000000, 1);

        for(i=0; i<paths.length; i++)
        {
            paths[i].draw(graphics);
        }
    }

    // draw cow at each node
    var i;
    for (i=0; i<nodeArray.length; i++)
    {
        this.add.image(nodeArray[i][0], nodeArray[i][1], 'cow');
    }

    // add disease to random path
    var maxPaths = paths.length-1;
    var randomPath = getRandomNumber(0, maxPaths);

    var disease = this.add.follower(paths[randomPath], 0,0, 'disease');
    disease.startFollow(
        {
            positionOnPath:true,
            duration:diseaseSpeed,
            onComplete: onFollowComplete,
            onCompleteParams: [ disease, paths ]
        }
    );
}

function onFollowComplete(tween, targets, gameObject, paths)
{
    // find the end point of current path
    var endPoint = gameObject.path.getEndPoint();
    // find other paths that start here
    var i, curPath;
    var validPaths = [];
    for (i=0; i<paths.length; i++)
    {
        curPath = paths[i];
        if(curPath.getStartPoint().equals(endPoint))
        {
            validPaths.push(curPath);
        }
    }
    // switch to a different path
    gameObject.setPath(validPaths[getRandomNumber(0, validPaths.length-1)]);
}

function getRandomNumber(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function update()
{
    
}

var game = new Phaser.Game(config);