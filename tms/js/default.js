////////////////////////////////////////////////////////////////////////////////////////////
//functions
////////////////////////////////////////////////////////////////////////////////////////////

function isEmpty(array){
 return(array === undefined || array.length == 0);
}

function debug_log(str){
    //console.log(str);
    //$('#turn').text(str);
}
function debug_log2(str){
    //console.log(str);
    //$('#time').text(str);
}

////////////////////////////////////////////////////////////////////////////////////////////
//classes
////////////////////////////////////////////////////////////////////////////////////////////

//TURN
////////////////////////////////////////////////////////////////////////////////////////////

var Turn = function(preTopic,preTopicDist,topic,topicDist,time){
    this.ID=Turn.turnCounter++;
    this.topic=topic;
    this.preTopic=preTopic;
    this.topicDist=topicDist;
    this.preTopicDist=preTopicDist;
    this.time=time;
    this.preTurn = Turn.preTurn;
    Turn.preTurn=this;
}

Turn.preTurn = null;
Turn.turnCounter=1;

Turn.getCurrent=function(){
    return Turn.turnCounter;
}

Turn.pop=function(){
    if(Turn.turnCounter>1){
        Turn.turnCounter--;
        Turn.preTurn=Turn.preTurn.topic.turns.pop();
        
    }
    return Turn.preTurn;
}

//TOPIC
////////////////////////////////////////////////////////////////////////////////////////////
var Topic = function(){
    this.turns=[];
    this.ID=topics.length;    
    topics.push(this);
    this.maxNegativeTopicDist = 0;
    this.maxPositiveTopicDist = 0;
    this.offsetX = 0;
    topics.updateOffsetX();
}

Topic.prototype.turnFrom=function(preTopic,preTopicDist,topicDist,time){
    this.turns.push(new Turn(preTopic,preTopicDist,this,topicDist,time));
    this.maxNegativeTopicDist=Math.min(this.maxNegativeTopicDist, topicDist);
    this.maxPositiveTopicDist=Math.max(this.maxPositiveTopicDist, topicDist);
    topics.updateOffsetX();
}
Topic.prototype.getSpan=function(){
    //debug_log("Topic span")
    return this.maxPositiveTopicDist-this.maxNegativeTopicDist+1;
}


////////////////////////////////////////////////////////////////////////////////////////////
//static objects/global singletons
////////////////////////////////////////////////////////////////////////////////////////////

//SCREEN
// ++===================================================================++ ---
// ++===================================================================++  |H
// ||                                    STEP: 14  |     _     _  TIMER ||  |E
// ||                                              |   | _| . |_  _|    ||  |A
// ||                                              |   ||_  .  _||_|    ||  |D
// ||===================================================================||  |E
// || < |                          UP | DOWN                        | > ||  |R
// ++===================================================================++  |
// ++===================================================================++ --- ---
// ||   ||       TOPIC A         ||          TOPIC B      ||-------||   ||  |D  |TOPIC
// ||=====================================================||-------||   ||  |I  |VIEW
// ||   || 0/-1| 0/0 | 0/+1| 0/+2|| 0/-2| 0/-1| 0/0 | 0/+1||-------||   ||  |S  |
// ||=====================================================||-------||   ||  |P ---
// ||   ||     |     |     |     ||  x  |     |     |     ||-------||   ||  |L  |OFFSCREEN
// ||=====================================================||-------||---||  |A ---
// || 11||     |  x  |     |     ||     |     |     |     ||-------||11 ||  |Y  |TEMPLATE
// ||   ||     |    x|     |     ||     |     |     |     ||-------||   ||  |   |
// ||---++-----+-----+-----+-----++-----+-----+-----+-----||-------||---||  |   |
// || 12||     |     |  x  |     ||     |     |     |     ||-------||12 ||  |   |
// ||   ||     |     |  x  |     ||     |     |     |     ||-------||   ||  |   |
// ||---++-----+-----+-----+-----++-----+-----+-----+-----||-------||---||  |   |
// || 13||     |     |  x  |     ||     |     |     |     ||-------||13 ||  |   |
// ||   ||     |     |     |     ||     |     |     |     ||-------||   ||  |   |
// ++===================================================================++  |  ---
// || 14||     |     |     |     ||     |     |     |     ||-------||14 ||  |   |CURRENT
// ||   ||     |     |     |     ||     |     |     |     ||-------||   ||  |   |TURN
// ++===================================================================++ --- ---
// ++===================================================================++  |FOOTER
// || SAVE ||                                || STOP/  || OVER ||  _|_  ||  |
// ||      ||                                || PLAY   || VIEW ||   |   ||  |
// ++===================================================================++  |
// ++===================================================================++ ---

 
var screen={
} 
screen.offsetX = 0;
screen.offsetY = 0;
screen.lineColor = '#f00';
screen.refSize = 70;
screen.partbgColor = '#fff';
screen.partBorderColor = '#ccc';
screen.elembgColor = '#fff';
screen.elemBorderColor = '#555';
screen.dicTopic = ["A","B","C","D","E","F","G","H","I","J","K","L",
                   "M","N","O","P","Q","R","S","T","U","V","W","X",
                   "Y","Z"];
screen.textColor="#555";
screen.init=function(){
    //HEADER
    screen.header =$('#header');
    //DISPLAY
    screen.display=$('#display');
        screen.canvas=document.getElementById('canvas');
        screen.context=document.getElementById('canvas').getContext("2d");
        
        screen.leftBorder={elem:{}};
        
        screen.topicView={elem:{}};
        screen.offscreen={elem:{}};
        screen.template={elem:{}};
        screen.currentTurn={elem:{}};
        
        screen.rightBorder={elem:{}};
                
        screen.update();
        screen.offsetX=(-2)*screen.template.elem.width+screen.template.width/2;
        screen.draw();

    //FOOTER
    screen.footer =$('#footer');

    $(window).resize(function(e){screen.update();screen.draw();});
} 

screen.update=function(e){
    screen.canvas.width=$('#display').width();
    screen.canvas.height=$('#display').height();
    debug_log("Screen: Canvas("+screen.canvas.width+","+screen.canvas.height+")");
    
    
    screen.context.font="10px Arial";

    screen.leftBorder.x           = 0;
    screen.leftBorder.y           = 0;
    screen.leftBorder.width       = screen.refSize*1.3;
    screen.leftBorder.height       = screen.canvas.height-2*screen.leftBorder.y;
    screen.leftBorder.bgColor     = screen.partbgColor;
    screen.leftBorder.borderColor = screen.partBorderColor;
    screen.leftBorder.elem.width       = screen.refSize*1.3;
    screen.leftBorder.elem.height       = screen.refSize;
    screen.leftBorder.elem.bgColor     = screen.elembgColor;
    screen.leftBorder.elem.borderColor = '#ddd';
    
        screen.rightBorder.x           = screen.canvas.width-screen.refSize*0.7-screen.leftBorder.x;
    screen.rightBorder.y           = screen.leftBorder.y;
    screen.rightBorder.width       = screen.refSize*0.7;
    screen.rightBorder.height      = screen.leftBorder.height;
    screen.rightBorder.bgColor     = screen.leftBorder.bgColor;
    screen.rightBorder.borderColor = screen.leftBorder.borderColor;
    screen.rightBorder.elem.width       = screen.refSize*0.7;
    screen.rightBorder.elem.height      = screen.leftBorder.elem.height;
    screen.rightBorder.elem.bgColor     = screen.leftBorder.elem.bgColor;
    screen.rightBorder.elem.borderColor = screen.leftBorder.elem.borderColor;

    screen.topicView.x           = screen.leftBorder.x+screen.leftBorder.width; 
    screen.topicView.y           = screen.leftBorder.y; 
    screen.topicView.width       = screen.canvas.width-2*screen.leftBorder.x
                                      - screen.leftBorder.width
                                      -screen.rightBorder.width;
    screen.topicView.height      = screen.refSize;
    screen.topicView.bgColor     = screen.partbgColor;
    screen.topicView.borderColor = screen.partBorderColor;
    screen.topicView.elem.width       = screen.refSize;
    screen.topicView.elem.height      = screen.refSize/2;
    screen.topicView.elem.bgColor     = screen.elembgColor;
    screen.topicView.elem.borderColor = screen.elemBorderColor;

    
    screen.offscreen.x           = screen.leftBorder.x+screen.leftBorder.width; 
    screen.offscreen.y           = screen.leftBorder.y+screen.topicView.height; 
    screen.offscreen.width       = screen.canvas.width-2*screen.leftBorder.x
                                      - screen.leftBorder.width
                                      -screen.rightBorder.width;
    screen.offscreen.height      = screen.refSize/2;
    screen.offscreen.bgColor     = screen.partbgColor;
    screen.offscreen.borderColor = screen.partBorderColor;
    screen.offscreen.elem.width       = screen.refSize;
    screen.offscreen.elem.height      = screen.refSize/2;
    screen.offscreen.elem.bgColor     = screen.elembgColor;
    screen.offscreen.elem.borderColor = screen.elemBorderColor;
    

    screen.currentTurn.x           = screen.leftBorder.x+screen.leftBorder.width; 
    screen.currentTurn.y           = screen.leftBorder.y+screen.topicView.height+screen.offscreen.height;
    screen.currentTurn.startY      = screen.leftBorder.y+screen.topicView.height+screen.offscreen.height;
    screen.currentTurn.maxY        = screen.canvas.height-screen.leftBorder.y-screen.refSize;
    screen.currentTurn.width       = screen.canvas.width-2*screen.leftBorder.x
                                      - screen.leftBorder.width
                                      -screen.rightBorder.width;
    screen.currentTurn.height      = screen.refSize;
    screen.currentTurn.bgColor     = screen.partbgColor;
    screen.currentTurn.borderColor = '#f00';
    screen.currentTurn.elem.width       = screen.refSize;
    screen.currentTurn.elem.height      = screen.refSize;
    screen.currentTurn.elem.bgColor     = screen.elembgColor;
    screen.currentTurn.elem.borderColor = screen.elemBorderColor;
    
    screen.template.x           = screen.leftBorder.x+screen.leftBorder.width; 
    screen.template.y           = screen.leftBorder.y+screen.topicView.height+screen.offscreen.height; 
    screen.template.width       = screen.canvas.width-2*screen.leftBorder.x
                                      - screen.leftBorder.width
                                      -screen.rightBorder.width;
    screen.template.height      = canvas.height-screen.offscreen.height-screen.topicView.height-screen.leftBorder.y*2;
    screen.template.bgColor     = screen.partbgColor;
    screen.template.borderColor = screen.partBorderColor;
    screen.template.elem.width       = screen.refSize;
    screen.template.elem.height      = screen.refSize;
    screen.template.elem.bgColor     = screen.elembgColor;
    screen.template.elem.borderColor = screen.elemBorderColor;
    
  
    
    var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
    screen.offsetY = Math.min(0,nElemsY-1-Turn.getCurrent())*screen.template.elem.height;
    
       
}
screen.drawPartWithBg=function(part){
    screen.context.save();
    screen.context.fillStyle=part.bgColor;
    screen.context.fillRect(part.x,part.y,part.width,part.height); 
    screen.context.strokeStyle=part.borderColor;
    screen.context.lineWidth=2;
    screen.context.strokeRect(part.x,part.y,part.width,part.height); 
    screen.context.restore();
}
screen.drawPart=function(part){
    screen.context.save();
    //screen.context.fillStyle=part.bgColor;
    //screen.context.fillRect(part.x,part.y,part.width,part.height); 
    screen.context.strokeStyle=part.borderColor;
    screen.context.lineWidth=2;
    screen.context.strokeRect(part.x,part.y,part.width,part.height); 
    screen.context.restore();
}

screen.drawLine=function(px,py,ux,uy,color,lwidth){
    screen.context.save();
    screen.context.beginPath();
    screen.context.strokeStyle=color;
    screen.context.lineWidth=lwidth;
    screen.context.moveTo(px,py);
    screen.context.lineTo(ux,uy);
    //screen.context.closePath();
    screen.context.stroke();
    screen.context.restore();
}

screen.drawPoint=function(px,py,color){
    screen.context.save();
    if(color==null){
        color = "red";
    }
    var w = 5;
    var h = 5;
    screen.context.fillStyle = color;
    screen.context.fillRect(px-w/2.0,py-h/2.0,w,h);
    screen.context.restore();
}


screen.drawHeader=function(topicsList,turn){
 screen.context.save();
    var offsetX=screen.offsetX+screen.template.x;
    var iTopic = 0;
    var size=screen.template.height-screen.template.elem.height;
    var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
    var offset =  screen.template.height%screen.template.elem.height;
    var counter=0;
    var maxI=0;
    var ix=0;
    screen.drawPartWithBg(screen.topicView);
    screen.drawPartWithBg(screen.offscreen);
    
    

    while(offsetX < screen.template.x+screen.template.width && iTopic<topicsList.length){
        maxI =topicsList[iTopic].getSpan()+2;
        
        for (ix = 0; ix< maxI;ix++){
            if (ix == 0){
                    screen.drawLine(
                            offsetX,
                            screen.topicView.y,
                            offsetX,
                            screen.topicView.y+screen.topicView.height,
                            screen.topicView.elem.borderColor,
                            2);
            }else if (ix == maxI-1){
                    screen.drawLine(
                            offsetX+screen.topicView.elem.width,
                            screen.topicView.y,
                            offsetX+screen.topicView.elem.width,
                            screen.topicView.y+screen.topicView.height,
                            screen.topicView.elem.borderColor,
                            2);
            }
            offset =  screen.template.height%screen.template.elem.height;

            //Draw Numbers in Topic View
           if(ix+topicsList[iTopic].maxNegativeTopicDist-1==0){
                screen.context.fillText(screen.dicTopic[iTopic%screen.dicTopic.length]
                +Math.floor(iTopic/screen.dicTopic.length),
                    offsetX+screen.template.elem.width/2-8,
                    screen.topicView.y+screen.topicView.elem.height-5);
            }

                screen.context.fillStyle=screen.textColor;    
                screen.context.fillText(ix+topicsList[iTopic].maxNegativeTopicDist-1,
                offsetX+screen.template.elem.width/2-5,screen.topicView.y+screen.topicView.elem.height*2-5);
                
            //Draw Offscreen
                
            offsetX+= screen.template.elem.width;
            
        }
        iTopic++;

    }
    screen.context.fillStyle=screen.leftBorder.elem.bgColor;
    screen.context.fillRect(screen.leftBorder.x,
                screen.leftBorder.y,//+screen.offsetY,
                screen.leftBorder.elem.width,
                screen.template.y); 
    screen.context.fillStyle=screen.rightBorder.elem.bgColor;
    screen.context.fillRect(screen.rightBorder.x,
                screen.rightBorder.y,//+screen.offsetY,
                screen.rightBorder.elem.width,
                screen.template.y); 
              
    screen.context.restore();

}
screen.drawTopics=function(topicsList,turn){
    screen.context.save();
    var offsetX=screen.offsetX+screen.template.x;
    var iTopic = 0;
    var size=screen.template.height-screen.template.elem.height;
    var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
    var offset =  screen.template.height%screen.template.elem.height;
    var counter=0;
    var maxI=0;
    var ix=0;
    screen.drawPartWithBg(screen.topicView);
    screen.drawPartWithBg(screen.offscreen);
    screen.drawLine(
                            screen.template.x,
                            screen.template.y+offset,//+screen.offsetY,
                            screen.template.x+screen.template.width,
                            screen.template.y+offset,//+screen.offsetY,
                            screen.template.elem.borderColor,
    5);
    

    while(offsetX < screen.template.x+screen.template.width && iTopic<topicsList.length){
        maxI =topicsList[iTopic].getSpan()+2;
        for (ix = 0; ix< maxI;ix++){
            screen.context.save();
            offset =  screen.template.height%screen.template.elem.height;
                
            counter=turn;
            while(offset<=size&&counter>=0){
              if (ix == 0){
                    screen.drawLine(
                            offsetX,
                            screen.template.y+offset,//+screen.offsetY,
                            offsetX,
                            screen.template.y+offset/*+screen.offsetY*/+screen.template.elem.height,
                            screen.template.elem.borderColor,
                            5);
               }else if (ix == maxI-1){
                    screen.drawLine(
                            offsetX+screen.template.elem.width,
                            screen.template.y+offset,//+screen.offsetY,
                            offsetX+screen.template.elem.width,
                            screen.template.y+offset/*+screen.offsetY*/+screen.template.elem.height,
                            screen.template.elem.borderColor,
                            5);
                }
                counter--;
                screen.context.save();
                //screen.context.fillStyle=screen.template.elem.bgColor;
                //screen.context.fillRect(offsetX,
                //     screen.template.y+offset,
                //    screen.template.elem.width,
                //    screen.template.elem.height);  
                screen.context.strokeStyle=screen.template.elem.borderColor;
                screen.context.lineWidth=1;
                screen.context.strokeRect(offsetX,
                    screen.template.y+offset,//+screen.offsetY,
                    screen.template.elem.width,
                    screen.template.elem.height);  
                screen.context.restore();
                
                offset+=screen.template.elem.height;

            
            }
            screen.context.restore();
            offsetX+= screen.template.elem.width;
            
        }
        iTopic++;

    }
    
    screen.drawPartWithBg(screen.rightBorder);
    screen.context.restore();
}

screen.drawTurns=function(topicsList,turn){
    debug_log2("Screen: draw turns");  
    screen.context.save();
    var iTurn = 0;
    var p1 = {x:0, y:-1};
    var p2 = {x:0, y:-1};
    p1=screen.getLocalPos(p1);
    p2=screen.getLocalPos(p2);
    var offsetX=screen.offsetX+screen.template.x+screen.template.elem.width/2;
    var iTopic = 0;
    var size=screen.template.height-screen.template.elem.height;
    var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
    var offset =  screen.template.height%screen.template.elem.height;
    var turnsList=[];
    var topic1X = 0; 
    var topic2X = 0; 
    var iTopic = 0;
    var minutes = 0;
    var seconds = 0;
    var turnCounter =Turn.getCurrent()-1;
    var turnI =Turn.getCurrent()+Math.floor(screen.offsetY/screen.template.elem.height);
    var maxy=turnI*screen.rightBorder.elem.height+offset;
    
     
    screen.drawPartWithBg(screen.leftBorder);
    while(/*offsetX < screen.template.x+screen.template.width &&*/ iTopic<topicsList.length){
        debug_log2("Screen: draw turns - draw topic");  
        iTurn = 0;
        turnsList=topicsList[iTopic].turns;
      
        while(/*offsetX < screen.template.x+screen.template.width &&*/ iTurn<turnsList.length){
        
        debug_log2("Screen: draw turns - draw topic - draw turn");  
            topic1X  = turnsList[iTurn].preTopic.offsetX
                        -turnsList[iTurn].preTopic.maxNegativeTopicDist+1;
            topic2X  = turnsList[iTurn].topic.offsetX
                        -turnsList[iTurn].topic.maxNegativeTopicDist+1;
        
            p1.x = topic1X+ turnsList[iTurn].preTopicDist;
            p1.y = turnsList[iTurn].ID-1;
            
           
            
            p2.x = topic2X+turnsList[iTurn].topicDist;
            p2.y = turnsList[iTurn].ID;
            
            p1=screen.getLocalPos(p1);
            p2=screen.getLocalPos(p2);
            debug_log2("Screen: drawTurns() - from p1("+p1.x+","+p1.y+") to p2("+p2.x+","+p2.y+") ");  
            screen.drawLine(p1.x,p1.y,p2.x,p2.y,"#f00",5);
            

            screen.context.fillStyle=screen.leftBorder.elem.bgColor;
            screen.context.fillRect(screen.leftBorder.x,
                p1.y-screen.leftBorder.elem.height/2,//+screen.offsetY,
                screen.leftBorder.elem.width,
                screen.leftBorder.elem.height); 
                

        screen.context.fillStyle=screen.leftBorder.elem.bgColor;
        screen.context.strokeStyle=screen.leftBorder.elem.borderColor;
        screen.context.lineWidth=1;
        screen.context.strokeRect(screen.leftBorder.x,
                p1.y-screen.leftBorder.elem.height/2,//+screen.offsetY,
                screen.leftBorder.elem.width,
                screen.leftBorder.elem.height); 


        screen.context.fillStyle=screen.rightBorder.elem.bgColor;
        screen.context.fillRect(screen.rightBorder.x,
             p1.y-screen.leftBorder.elem.height/2,//+screen.offsetY,
            screen.rightBorder.elem.width,
            screen.rightBorder.elem.height);  
        screen.context.strokeStyle=screen.rightBorder.elem.borderColor;
        screen.context.lineWidth=1;
        screen.context.strokeRect(screen.rightBorder.x,
            p1.y-screen.leftBorder.elem.height/2,
            screen.rightBorder.elem.width,
            screen.rightBorder.elem.height);  
       screen.context.fillStyle=screen.textColor;  
       screen.context.fillText(turnsList[iTurn].ID-1,screen.rightBorder.x+5,p1.y);
        
        screen.context.fillStyle=screen.rightBorder.elem.bgColor;
        screen.context.fillRect(screen.rightBorder.x,
             p2.y-screen.leftBorder.elem.height/2,//+screen.offsetY,
            screen.rightBorder.elem.width,
            screen.rightBorder.elem.height);  
        screen.context.strokeStyle=screen.rightBorder.elem.borderColor;
        screen.context.lineWidth=1;
        screen.context.strokeRect(screen.rightBorder.x,
            p2.y-screen.leftBorder.elem.height/2,
            screen.rightBorder.elem.width,
            screen.rightBorder.elem.height);  
       screen.context.fillStyle=screen.textColor;  
       screen.context.fillText(turnsList[iTurn].ID,screen.rightBorder.x+5,p2.y);
        
        debug_log("Screen: offset border tmp elems: "+offset);
        
               
            screen.context.fillStyle=screen.textColor;  
            seconds = Math.floor(turnsList[iTurn].time/1000)%60;
            minutes = Math.floor(turnsList[iTurn].time/1000/60);
            screen.context.fillText( minutes+":"+seconds,screen.leftBorder.x+5,p1.y+5);
            iTurn++;

            
        }
        

            
             
        offsetX += (topicsList[iTopic].getSpan()+2)*screen.template.elem.width;
        iTopic++;
    }
    
    //White clean above
        screen.context.fillStyle=screen.leftBorder.elem.bgColor;
        screen.context.fillRect(screen.leftBorder.x,
                screen.leftBorder.y,//+screen.offsetY,
                screen.leftBorder.elem.width,
                screen.template.y+offset-screen.leftBorder.y); 
              
        screen.context.fillStyle=screen.rightBorder.elem.bgColor;
        screen.context.fillRect(screen.rightBorder.x,
            screen.rightBorder.y,//+screen.offsetY,
            screen.leftBorder.elem.width,
            screen.template.y+offset-screen.leftBorder.y);
            
        
    //White clean bottom
        screen.context.fillStyle=screen.leftBorder.elem.bgColor;
        screen.context.fillRect(screen.leftBorder.x,
                maxy+screen.leftBorder.elem.height/2,//+screen.offsetY,
                screen.leftBorder.elem.width,
                screen.leftBorder.elem.height*2); 
    
    //Draw Numbering to End 
           
            screen.context.fillStyle=screen.rightBorder.elem.bgColor;
        screen.context.fillRect(screen.rightBorder.x,
             maxy+screen.leftBorder.elem.height/2,//+screen.offsetY,
            screen.rightBorder.elem.width,
            screen.rightBorder.elem.height);  
        screen.context.strokeStyle=screen.rightBorder.elem.borderColor;
        screen.context.lineWidth=1;
        screen.context.strokeRect(screen.rightBorder.x,
            maxy+screen.leftBorder.elem.height/2,
            screen.rightBorder.elem.width,
            screen.rightBorder.elem.height);  
       screen.context.fillStyle=screen.textColor;  
       screen.context.fillText(turnCounter,screen.rightBorder.x+5,maxy+screen.leftBorder.elem.height);
        
        turnCounter++;
        screen.context.fillStyle=screen.rightBorder.elem.bgColor;
        screen.context.fillRect(screen.rightBorder.x,
             maxy+3*screen.leftBorder.elem.height/2,//+screen.offsetY,
            screen.rightBorder.elem.width,
            screen.rightBorder.elem.height);  
        screen.context.strokeStyle=screen.rightBorder.elem.borderColor;
        screen.context.lineWidth=1;
        screen.context.strokeRect(screen.rightBorder.x,
            maxy+3*screen.leftBorder.elem.height/2,
            screen.rightBorder.elem.width,
            screen.rightBorder.elem.height);  
       screen.context.fillStyle=screen.textColor;  
       screen.context.fillText(turnCounter,screen.rightBorder.x+5,maxy+screen.leftBorder.elem.height*2);   
    //Draw CurrentTurn    
    screen.currentTurn.y = maxy+3*screen.leftBorder.elem.height/2;     
    screen.leftBorder.elem.height;
    screen.drawPart(screen.currentTurn);
    screen.context.restore();
    
}

screen.getNearestPos=function(pos){
    var size=screen.template.height-screen.template.elem.height;
    var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
    var offsetTop =  screen.template.height%screen.template.elem.height;
    var x = pos.x-screen.template.x-screen.offsetX%screen.template.elem.width
    -screen.template.elem.width/2;
    var y = pos.y-screen.template.y-offsetTop+screen.offsetY%screen.template.elem.height
    -screen.template.elem.height/2;
    var diffX = x%screen.template.elem.width;
    if(diffX>screen.template.elem.width/2){
        x += screen.template.elem.width;
    }
    x-=diffX;
    var diffY = y%screen.template.elem.height;
    if(diffY>screen.template.elem.height/2){
        y += screen.template.elem.height;
    }
    y-=diffY;  
    x += screen.template.x+screen.offsetX%screen.template.elem.width
    +screen.template.elem.width/2;
    y += screen.template.y+offsetTop-screen.offsetY%screen.template.elem.height
    +screen.template.elem.height/2; 
    
    return {x:x,y:y};
   
    
}
screen.getGlobalCoords=function(pos){
    var size=screen.template.height-screen.template.elem.height;
    var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
    var offsetTop =  screen.template.height%screen.template.elem.height;
    var npos = screen.getNearestPos(pos);
    debug_log("Screen: Local Pos("+npos.x+","+npos.y+")"); 
    npos.x = Math.floor((npos.x-screen.offsetX-screen.template.x)/screen.template.elem.width); 
    npos.y = Math.floor((npos.y-screen.offsetY-screen.template.y-offsetTop)/screen.template.elem.height);
    debug_log("Screen: global Coord("+npos.x+","+npos.y+")"); 
    return npos;
}

screen.getLocalPos=function(coords){
    var size=screen.template.height-screen.template.elem.height;
    var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
    var offsetTop =  screen.template.height%screen.template.elem.height;
    debug_log("Screen: global Coord("+coords.x+","+coords.y+")"); 
    var npos = {
    x:coords.x*screen.template.elem.width+screen.offsetX+screen.template.x+screen.template.elem.width/2,
    y:coords.y*screen.template.elem.height+screen.offsetY+screen.template.y+offsetTop+screen.template.elem.height/2
    } 
    debug_log("Screen: Local Pos("+npos.x+","+npos.y+")"); 
    return npos;
}

screen.drawCurrentInteraction=function(start,current){
    screen.context.save();
    screen.draw();
    var p1 = screen.getNearestPos(start);
    screen.drawLine(
                            p1.x,
                            p1.y,
                            current.x,
                            current.y,
                            screen.lineColor,
    3);

    screen.context.restore();
}

screen.draw=function(){
    //Clear
    screen.context.save();
    screen.context.fillStyle='#fff';
    screen.context.fillRect(0,0,screen.canvas.width,screen.canvas.height); 
    screen.context.restore();
    
    //drawCurrent
    screen.drawTopics(topics,Turn.getCurrent());
    screen.drawTurns(topics,Turn.getCurrent());
    screen.drawHeader(topics,Turn.getCurrent());
    
    
    //draw Parts
    screen.drawPart(screen.template);
    screen.drawPart(screen.topicView);
    screen.drawPart(screen.offscreen);
    screen.drawPart(screen.leftBorder);
    screen.drawPart(screen.rightBorder);
    
    

}

//TOPICS
////////////////////////////////////////////////////////////////////////////////////////////
var topics = [];
topics.maxOffsetX=0;
topics.get = function(id){
    return topics(id);
}
topics.getNumber = function(){
    return topics.length;
}
topics.updateOffsetX=function(){
    var offsetX = 0;
    topics.forEach(function(topic){
        topic.offsetX = offsetX;
        offsetX+= topic.getSpan()+2; 
    });
    topics.maxOffsetX=offsetX;
}

//KI
////////////////////////////////////////////////////////////////////////////////////////////

var ki = {
    pShift:0.0,
    pNew:1.0,
    pFollowUp:0.0,
    pJump:0.0,
    pMerge:0.0,
    
    pShiftIShift:0.42,
    pNewIShift:0.03,
    pFollowUpIShift:0.2,
    pJumpIShift:0.2,
    pMergeIShift:0.05,
    
    pShiftINew:0.4,
    pNewINew:0.05,
    pFollowUpINew:0.3,
    pJumpINew:0.2,
    pMergeINew:0.05,
    
    pShiftIFollowUp:0.62,
    pNewIFollowUp:0.03,
    pFollowUpIFollowUp:0.25,
    pJumpIFollowUp:0.05,
    pMergeIFollowUp:0.05,
    
    pShiftIJump:052,
    pNewIJump:0.03,
    pFollowUpIJump:0.2,
    pJumpIJump:0.1,
    pMergeIJump:0.05,
    
    pShiftIMerge:0.52,
    pNewIMerge:0.03,
    pFollowUpIMerge:0.2,
    pJumpIMerge:0.105,
    pMergeIMerge:0.05,
    
    running:false
   
}

ki.Type={
    Shift: 0,
    New: 1,
    FollowUp: 2,
    Jump: 3,
    Merge: 4
}
ki.status=ki.Type.New;


ki.loop=function(){
    //Adaptve approach thinkable
    if(ki.running){
        var pX=Math.random();
   
      var cShift    =           ki.pShift;
      var cNew      = cShift  + ki.pNew;
      var cFollowUp = cNew    + ki.pFollowUp;
      var cJump     =cFollowUp+ ki.pJump;
      //var cSMerge =cJump    + ki.pMerge;//1
      
      if (ki.status == ki.Type.Shift){
         
          cShift    =           ki.pShiftIShift;
          cNew      = cShift  + ki.pNewIShift;
          cFollowUp = cNew    + ki.pFollowUpIShift;
          cJump     =cFollowUp+ ki.pJumpIShift;
          //cSMerge =cJump    + ki.pMergeIShift;//1

      } else if (ki.status == ki.Type.New){
          cShift    =           ki.pShiftINew;
          cNew      = cShift  + ki.pNewINew;
          cFollowUp = cNew    + ki.pFollowUpINew;
          cJump     =cFollowUp+ ki.pJumpINew;
          //cSMerge =cJump    + ki.pMergeINew;//1

      } else if (ki.status == ki.Type.FollowUp){
          cShift    =           ki.pShiftINewIFollowUp;
          cNew      = cShift  + ki.pNewIFollowUp;
          cFollowUp = cNew    + ki.pFollowUpIFollowUp;
          cJump     =cFollowUp+ ki.pJumpIFollowUp;
          //cSMerge =cJump    + ki.pMergeIFollowUp;//1

      } else if (ki.status == ki.Type.Jump){
          cShift    =           ki.pShiftIJump;
          cNew      = cShift  + ki.pNewIJump;
          cFollowUp = cNew    + ki.pFollowUpIJump;
          cJump     =cFollowUp+ ki.pJumpIJump;
          //cSMerge =cJump    + ki.pMergeIJump;//1

      

      } else /*if (ki.status == ki.Type.Merge)*/{
          cShift    =           ki.pShiftIMerge;
          cNew      = cShift  + ki.pNewIMerge;
          cFollowUp = cNew    + ki.pFollowUpIMerge;
          cJump     =cFollowUp+ ki.pJumpIMerge;
          //cSMerge =cJump    + ki.pMergeIMerge;//1


      }
          if(Turn.preTurn==null){
        topics[0].turnFrom(topics[0],
                                        0,
                                        0,
                                        controller.overallTime); 
    }
 
         if (pX<=cShift){
            Turn.preTurn.topic.turnFrom(Turn.preTurn.topic,
                 Turn.preTurn.topicDist,
                 Turn.preTurn.topicDist+1,
                 controller.overallTime); 
            ki.status=ki.Type.Shift; 

        } else if(pX<=cNew){
          var topic= new Topic();
          topic.turnFrom(topic,
                                      0,
                                      0,
                                      controller.overallTime); 
          ki.status=ki.Type.New; 
        } else if(pX<=cFollowUp){
          Turn.preTurn.topic.turnFrom(Turn.preTurn.topic,
                                        Turn.preTurn.topicDist,
                                        Turn.preTurn.topicDist,
                                        controller.overallTime); 
          ki.status=ki.Type.FollowUp; 
        
        }   else if(pX<=cJump){
          var rIdxTopic = Math.floor(Math.random()*topics.length);
          if(topics[rIdxTopic].turns.length==0){
                topics[rIdxTopic].turnFrom(topics[rIdxTopic],
                                        0,
                                        0,
                                        controller.overallTime); 
          }
          var rTurn  = topics[rIdxTopic].turns[topics[rIdxTopic].turns.length-1];
          rTurn.topic.turnFrom(rTurn.topic,
                                        rTurn.topicDist,
                                        rTurn.topicDist,
                                        controller.overallTime); 
          ki.status=ki.Type.Jump; 
        
        }   else /*if(pX<=cMerge)*/{
          var rIdxTopic = Math.floor(Math.random()*topics.length);
          if(topics[rIdxTopic].turns.length==0){
                topics[rIdxTopic].turnFrom(topics[rIdxTopic],
                                        0,
                                        0,
                                        controller.overallTime); 
          }
          var rTurn  = topics[rIdxTopic].turns[topics[rIdxTopic].turns.length-1];
          rTurn.topic.turnFrom(Turn.preTurn.topic,
                                        Turn.preTurn.topicDist,
                                        rTurn.topicDist,
                                        controller.overallTime); 
          ki.status=ki.Type.Merge; 
        
        }   

    
      var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
      screen.offsetY = Math.min(0,nElemsY-1-Turn.getCurrent())*screen.template.elem.height;
      screen.offsetX = (-Turn.preTurn.topic.offsetX+Turn.preTurn.topic.maxNegativeTopicDist-Turn.preTurn.topicDist-2)*screen.template.elem.width+screen.template.width/2;
      screen.draw();
      var timeout = Math.log(1-Math.random())/(-1/700);//in avarage 7000 miliseconds with speedup 10
      setTimeout(function(){ ki.loop(); }, timeout);
    }
}
ki.start=function(){
    ki.running = true;
    $("#btnSimulateIcon").removeClass('glyphicon-play-circle').addClass("glyphicon-ban-circle");
    ki.loop();

}

ki.stop=function(){
    ki.running = false;
    $("#btnSimulateIcon").removeClass('glyphicon-ban-circle').addClass("glyphicon-play-circle");
}

//Controller
////////////////////////////////////////////////////////////////////////////////////////////

var controller = {
    mouseIsDown:false,
    mousePos:{
            x: -1,
            y: -1 
        },
    startPos:{
            x: -1,
            y: -1 
        },
    btnSaveClicked: false,
    shifting: false,
    lastTime: 0,
    overallTime: 0,
    play: false
    
}
controller.pause=function(){
    controller.shifting=false;
    controller.play=false;
    $("#btnStopPlayIcon").removeClass('glyphicon-pause').addClass("glyphicon-play");

    
}
controller.replay=function(){
    controller.shifting=false;
    if (!controller.play){
        controller.play=true;
        $("#btnStopPlayIcon").removeClass("glyphicon-play").addClass("glyphicon-pause");
        var newTime =$.now();
        controller.lastTime= newTime;
   }
    
}
controller.initButtons=function(){
        $('#btnSave').click(function(){
            controller.btnSaveClicked=true;
            screen.refSize = 50;
            $('#display').width((topics.maxOffsetX+2)*screen.refSize);
            $('#display').height((Turn.getCurrent()+3)*screen.refSize);
            $('#display').css("position","absolute");
            //$('#display').css("top","0px");
            $('#footer').hide();
            $('#navi').hide();
            //$('#header').hide()
            $('body').css("overflow","scroll");
            screen.offsetX=0;
            screen.offsetY=0;
            screen.update();
            screen.draw();
            controller.pause();
            ki.stop();
            window.location = screen.canvas.toDataURL("image/png");
            $("#header").html('<a id="btnBack"  class="btn btn-default" aria-label="Left Align" type="button" href="index.html" style=" padding:40px; position:absolute; top:0; width:100%; height:100px;"><span class="glyphicon glyphicon-refresh" aria-hidden="true"></span></a>');
            
     
        });
        $('#btnSave').popover();
        $('#btnSave').popover({ trigger: "hover" });
        $('#btnUndo').click(function(){
            controller.shifting=false;
            var turn = Turn.pop();
            var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
            screen.offsetY = Math.min(0,nElemsY-Turn.getCurrent()-1)*screen.template.elem.height;
            screen.draw();
        });
        $('#btnSimulate').click(function(){
                controller.shifting=false;
                if(ki.running==true){
                    controller.pause();
                    ki.stop();
                }else{
                    controller.replay();
                    ki.start();
                }
        });
        
        $('#btnBackward').click(function(){
            controller.overallTime=Math.max(controller.overallTime-1000,0);
        });
        $('#btnBackward').dblclick(function(e){
            e.preventDefault();
            controller.overallTime=Math.max(controller.overallTime-58000,0);
        });
        $('#btnForward').click(function(){
             controller.overallTime+=1000;
        });
        $('#btnForward').dblclick(function(e){
             e.preventDefault();
             controller.overallTime+=58000;
        });
        $('#btnAddTopic').click(function(){
            controller.shifting=false;
            var topic = new Topic();
            screen.offsetX=(-topic.offsetX-topic.maxNegativeTopicDist-2)*screen.template.elem.width+screen.template.width/2;
            screen.draw();
        });
        $('#btnZoomIn').click(function(){
            controller.shifting=false;
            screen.refSize = Math.ceil(screen.refSize*1.1);
            screen.update();
            screen.draw();
            debug_log2("Controller: ZoomIn");
        });
        $('#btnZoomOut').click(function(){
            controller.shifting=false;
            screen.refSize = Math.ceil(screen.refSize*0.9);
            screen.update();
            screen.draw();
            debug_log2("Controller: ZoomOut");
        });
        $('#btnUp').click(function(){
            controller.shifting=false;
            if(screen.template.height-screen.template.elem.height*(Turn.turnCounter+1)<0){
                screen.offsetY-=screen.template.elem.height;
                screen.draw();
            }
            controller.pause();
            ki.stop();
        });
        $('#btnUp').dblclick(function(e){
            e.preventDefault();
            controller.shifting=false;
            if(screen.template.height-screen.template.elem.height*(Turn.turnCounter+1)<0){
                screen.offsetY-=4*screen.template.elem.height;
                screen.draw();
            }
            controller.pause();
            ki.stop();
        });
        $('#btnDown').click(function(){
            controller.shifting=false;
            if(screen.template.height-screen.template.elem.height*(Turn.turnCounter+1)<0){
                screen.offsetY+=screen.template.elem.height;
                screen.draw();
            }
            controller.pause();
            ki.stop();
        });
        $('#btnDown').dblclick(function(e){
            e.preventDefault();
            controller.shifting=false;
            if(screen.template.height-screen.template.elem.height*(Turn.turnCounter+1)<0){
                screen.offsetY+=4*screen.template.elem.height;
                screen.draw();
            }
            controller.pause();
            ki.stop();
        });
        $('#btnLeft').click(function(){
            controller.shifting=false;
            screen.offsetX+=(screen.template.elem.width+screen.offsetX%screen.template.elem.width);
            screen.draw();
        });
        $('#btnLeft').dblclick(function(e){
            controller.shifting=false;
            e.preventDefault();
            screen.offsetX+=4*(screen.template.elem.width+screen.offsetX%screen.template.elem.width);
            screen.draw();
        });
        $('#btnRight').click(function(){
            controller.shifting=false;
            screen.offsetX-=(screen.template.elem.width+screen.offsetX%screen.template.elem.width);
            screen.draw();
        });
        $('#btnRight').dblclick(function(e){
            controller.shifting=false;
            e.preventDefault();
            screen.offsetX-=4*(screen.template.elem.width+screen.offsetX%screen.template.elem.width);
            screen.draw();
        });
        $("#btnStopPlay").click(function(){
                if(controller.play){
                    controller.pause();
                    ki.stop();
                }else{
                    controller.replay();
                }
        });
        
        

            

}
var c= 0;
controller.init=function(){
        //init default topic
        new Topic();
        //init Buttons
        controller.initButtons();
        //init screen
        screen.init();
        //init display interaction and events
        screen.display.bind(
        'mousemove touchmove',
          function(e) {
            
            e.preventDefault();
            controller.mouseMove(e);

          }
        );
        screen.display.bind(
        'mouseup touchend',
          function(e) {
            
            e.preventDefault();
            controller.mouseUp(e);
          }
        );
         screen.display.bind(
        'mousedown touchstart',
          function(e) {
            
            e.preventDefault();
            controller.mouseDown(e);
          }
        );
         screen.display.bind(
        'mouseleave touchleave',
          function(e) {
            
            e.preventDefault();
            controller.mouseLeave(e);
          }
        );
        setInterval(function(){
                    if (controller.play){
                          var newTime =$.now();
                          controller.overallTime+=newTime-controller.lastTime;
                          controller.lastTime= newTime;
                    }
                    var seconds = Math.floor(controller.overallTime/1000)%60;
                    var minutes = Math.floor(controller.overallTime/1000/60);
                    $('#time').text(minutes+":"+seconds);
            },100);

        
}

controller.calculateTopic=function(pos){
    //get current global coord
    var coords=screen.getGlobalCoords(pos);
    //calculate Topic and Topic Distance
    var overallDist = 0;
    topicIdx = 0;
    while (topicIdx<topics.length){
        overallDist+=topics[topicIdx].getSpan()+2;
        debug_log2("Controller: overallDist "+overallDist);
        
        if(overallDist>coords.x){
            overallDist-=(topics[topicIdx].getSpan()+1);
            break;
        }
        topicIdx++;
    }
    return {
        topic: topics[topicIdx], 
        dist: coords.x-overallDist+topics[topicIdx].maxNegativeTopicDist
    };
    
}



controller.mouseDown=function(e){
    debug_log("Controller: mouse down.");
    try{
        var pageX = e.pageX;
        if(!pageX) { pageX = e.originalEvent.touches[0].pageX;}
    }catch(e){
        try{
            var pageX = e.originalEvent.touches[0].pageX;
        }catch(e){
            var pageX =0;
        }
        
    }
    try{
        var pageY = e.pageY;
        if(!pageY){ pageY = e.originalEvent.touches[0].pageY;}
    }catch(e){
        try{
            var pageY = e.originalEvent.touches[0].pageY;
        }catch(e){
            var pageY =0;
        }
        
    }
    if(pageX-10<Math.min(topics.maxOffsetX*screen.template.elem.width+screen.offsetX+screen.template.x,screen.rightBorder.x)
     && pageX-10>Math.max(screen.template.x,screen.template.x+screen.offsetX)
     && pageY-screen.header.height()-10<(Turn.getCurrent()+2)*screen.template.elem.height+screen.template.y//+screen.offsetY 
     && pageY-screen.header.height()-10>screen.template.y){
        controller.mouseIsDown=true;
        controller.startPos ={
            x: pageX-10,
            y: pageY-screen.header.height()-10
        };

    }
    ki.stop();
    controller.replay();
    
}
controller.mouseUp=function(e){
    debug_log("Controller: mouse up.");
    controller.shifting=false;
    try{
        var pageX = e.pageX;
        if(!pageX) { pageX = e.originalEvent.touches[0].pageX;}
    }catch(e){
        try{
            var pageX = e.originalEvent.touches[0].pageX;
        }catch(e){
            var pageX =0;
        }
        
    }
    try{
        var pageY = e.pageY;
        if(!pageY){ pageY = e.originalEvent.touches[0].pageY;}
    }catch(e){
        try{
            var pageY = e.originalEvent.touches[0].pageY;
        }catch(e){
            var pageY =0;
        }
        
    }
    if (!controller.btnSaveClicked
        && controller.mouseIsDown){
        //add Turn
        
        var oldT = controller.calculateTopic(controller.startPos);
        if(pageX-10>Math.min(topics.maxOffsetX*screen.template.elem.width+screen.offsetX+screen.template.x,screen.rightBorder.x)){
            var newT = {
                topic: new Topic(),
                dist: 0
            }  
        }else{
            var newT = controller.calculateTopic(controller.mousePos); 
        }      


        newT.topic.turnFrom(oldT.topic,oldT.dist,newT.dist,controller.overallTime);  
        
        debug_log2("Controller: newT.dist "+newT.dist);
        debug_log2("Controller: oldT.dist "+oldT.dist);
        var nElemsY =  Math.floor(screen.template.height/screen.template.elem.height);
        screen.offsetY = Math.min(0,nElemsY-1-Turn.getCurrent())*screen.template.elem.height;
        screen.offsetX = (-newT.topic.offsetX+newT.topic.maxNegativeTopicDist-newT.dist-2)*screen.template.elem.width+screen.template.width/2;
        screen.draw();

        $('#turn').text(Turn.getCurrent());
        
    }
    controller.mouseIsDown=false;
    
}
controller.shiftLoop=function(direction){
    if(controller.shifting){
        screen.offsetX+=direction;
        controller.startPos.x+=direction; 
        screen.draw();
        setTimeout(function(){controller.shiftLoop(direction)},100);
    }
    
}
controller.mouseMove=function(e){
    e.preventDefault();
    if(!controller.btnSaveClicked){
        try{
            var pageX = e.pageX;
            if(!pageX) { pageX = e.originalEvent.touches[0].pageX;}
        }catch(e){
            try{
                var pageX = e.originalEvent.touches[0].pageX;
            }catch(e){
                var pageX =0;
            }
            
        }
        try{
            var pageY = e.pageY;
            if(!pageY){ pageY = e.originalEvent.touches[0].pageY;}
        }catch(e){
            try{
                var pageY = e.originalEvent.touches[0].pageY;
            }catch(e){
                var pageY =0;
            }
            
        }
        controller.mousePos ={
            x: pageX-10,
            y: pageY-screen.header.height()-10 
        };
                 
        debug_log("Controller: pos("+controller.mousePos.x+","+controller.mousePos.y+")");
        if(controller.mousePos.x<screen.leftBorder.x+screen.refSize/2){
            controller.shifting=true;
            controller.shiftLoop(4);
        }else if(controller.mousePos.x>screen.canvas.width-screen.refSize/2)    
        {
            controller.shifting=true;
            controller.shiftLoop(-4);
        }else{
            controller.shifting=false;
        }
        
        if(controller.mouseIsDown){
            debug_log("Controller: mouse moves while down.");
            screen.drawCurrentInteraction(controller.startPos,controller.mousePos);
            
        }else{
     
        }
    }
    
}
controller.mouseLeave=function(e){
    controller.mousePos ={
        x: -1,
        y: -1
    };
    controller.mouseIsDown=false;
    controller.shifting=false;
    screen.draw();
    debug_log("Controller: pos("+controller.mousePos.x+","+controller.mousePos.y+")");
}

////////////////////////////////////////////////////////////////////////////////////////////
//START
////////////////////////////////////////////////////////////////////////////////////////////

$( document ).ready(function() {
    debug_log( "Document Ready: init controller." );
    controller.init();
 
////////////////////////////////////////////////////////////////////////////////////////////
//END
////////////////////////////////////////////////////////////////////////////////////////////   
});
