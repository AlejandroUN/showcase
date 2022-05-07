let img00, img01, img02, img03, img04, img05, img06, img07, img08, img09, img10, img11, img12;
let images, curImage, curNumber, circles, unanswered, correct, wrong;
let i = 13, points = 0;
let correctAnswers = [12, 74, 6, 16, 2, 29, 7, 45, 5, 97, 8, 42, 3];
let c00, c01, c02, c03, c04, c05, c06, c07, c08, c09, c10, c11, c12;
let circleColors = [];
let inputImg, img;

function preload(){
    img00 = loadImage('../resources/images/ishiharaTest/Ishihara_00.jpg')
    img01 = loadImage('../resources/images/ishiharaTest/Ishihara_01.jpg')
    img02 = loadImage('../resources/images/ishiharaTest/Ishihara_02.jpg')
    img03 = loadImage('../resources/images/ishiharaTest/Ishihara_03.jpg')
    img04 = loadImage('../resources/images/ishiharaTest/Ishihara_04.jpg')
    img05 = loadImage('../resources/images/ishiharaTest/Ishihara_05.jpg')
    img06 = loadImage('../resources/images/ishiharaTest/Ishihara_06.jpg')
    img07 = loadImage('../resources/images/ishiharaTest/Ishihara_07.jpg')
    img08 = loadImage('../resources/images/ishiharaTest/Ishihara_08.jpg')
    img09 = loadImage('../resources/images/ishiharaTest/Ishihara_09.jpg')
    img10 = loadImage('../resources/images/ishiharaTest/Ishihara_10.jpg')
    img11 = loadImage('../resources/images/ishiharaTest/Ishihara_11.jpg')
    img12 = loadImage('../resources/images/ishiharaTest/Ishihara_12.jpg')
}

function setup() {
    createCanvas(630, 430);
    angleMode(DEGREES)
    frameRate(5)
    background(220); 
    noStroke()

    images = [img00, img01, img02, img03, img04, img05, img06, img07, img08, img09, img10, img11, img12]
    curImage = images[0];
    
    unanswered = color(142)
    correct = color(0,148,18)
    wrong = color(247,0,0)

    for(let j=0; j<images.length; j++){
        circleColors.push(unanswered)
    }
    
    inputNumber = createInput('', 'number')
    inputNumber.position(490, 190)
    inputNumber.size(70)
    inputNumber.style('font-size', '30px')
    
    nextButton = createButton("Next");
    nextButton.position(550,260);
    
    nextButton.mousePressed(()=>{
        checkNumber();
        if ( i<= 12){
            i += 1
        }
        if(i == 13){
            showResults();
        }
        buttonsState();
    })

    prevButton = createButton("Previous");
    prevButton.position(480,260);
    prevButton.mousePressed(()=>{        
        if (i>0 && i<=13){
            i -= 1
        }
        buttonsState();
    })  

    buttonsState();

    restartButton = createButton("Restart");
    restartButton.position(230,343);
    restartButton.mousePressed(()=>{        
        i = 0
        buttonsState();
        circleColors = []
        for(let j=0; j<images.length; j++){
            circleColors.push(unanswered)
        }
        // viewerButton.html(">")
        // viewerButton.position(600,15);
        // viewerButton.style('font-size', '20px')
        viewerButton.style('display', 'none')
    })
    restartButton.style('font-size', '20px')
    restartButton.style('display', 'none')

    viewerButton = createButton(">");
    viewerButton.position(600,15);
    viewerButton.mousePressed(()=>{        
        imageViewer();
    })
    viewerButton.style('font-size', '20px')
    viewerButton.style('display', 'none')

    // inputImg = createFileInput(handleFile);
    // inputImg.position(250, 400);

  }

function draw(){
    if(i <= 12){
        background(220); 
        fill(0, 0, 0)

        curImage = images[i];
        curImage.resize(427, 427)
        image(curImage, 0 , 0)
        
        textSize(34);
        textAlign(CENTER, CENTER);
        text(i+"/12", 450, 10, 150, 100)

        textSize(20);
        textAlign(CENTER, CENTER);
        text("What number are you seeing?", 450, 80, 150, 100)

        inputNumber.style('display', 'block')
        prevButton.style('display', 'block')
        nextButton.style('display', 'block')
        restartButton.style('display', 'none')
        // viewerButton.style('display', 'none')
    
        // fill(c00)
        fill(circleColors[0])
        circle(510, 310, 15);
        fill(0, 0, 0)
        textSize(10);
        textAlign(CENTER, CENTER);
        text("Example", 540, 310)

        fill(circleColors[1])
        circle(485, 340, 15);
        fill(circleColors[2])
        circle(515, 340, 15);
        fill(circleColors[3])
        circle(545, 340, 15);
        fill(circleColors[4])
        circle(575, 340, 15);
        fill(circleColors[5])
        circle(485, 370, 15);
        fill(circleColors[6])
        circle(515, 370, 15);
        fill(circleColors[7])
        circle(545, 370, 15);
        fill(circleColors[8])
        circle(575, 370, 15);
        fill(circleColors[9])
        circle(485, 400, 15);
        fill(circleColors[10])
        circle(515, 400, 15);
        fill(circleColors[11])
        circle(545, 400, 15);
        fill(circleColors[12])
        circle(575, 400, 15);    
    }else{
        showResults()
    }

    // background(255);
    if (img) {
        if(img.height*(width-60)/img.width > height-80){
            image(img, (width-(img.width*(height-80)/img.height))/2, 30, img.width*(height-80)/img.height, height-80)    
        }else{
            image(img, 30, 30, width-60, img.height*(width-60)/img.width)
        }
    }
}

function buttonsState(){
    if(i>0){
        prevButton.removeAttribute('disabled');
    }else{
        prevButton.attribute('disabled', '');
    }

    if(i == 12){
        nextButton.html("Finish");
    }else{
        nextButton.html("Next");
    }
}

function checkNumber(){
    
    if(int(inputNumber.value()) === correctAnswers[i]){
        if(i>0) points += 1
        circleColors[i] = correct
    }else{
        circleColors[i] = wrong
    }
    inputNumber.value('')
}

function showResults(){
    background(220);
    fill(0, 0, 0)
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Results", 320, 50)
    textSize(34);
    text(points + "/12", 320, 100)
    if(points > 9){
        text("Great!" , 15, 150, 600, 40)
        textSize(30);
        text("You don't have red-green color blindness" , 15, 180, 600, 100)
    }else{
        text("Ooops!" , 15, 150, 600, 40)
        textSize(24);
        text("It would be better if you go and see an optometrist.\nYou probably have red-green color blindness", 15, 220, 600, 50)
    }
    
    inputNumber.style('display', 'none')
    prevButton.style('display', 'none')
    nextButton.style('display', 'none')
    restartButton.style('display', 'block')
    
    viewerButton.html("Image Viewer")
    viewerButton.position(320,340);
    viewerButton.style('font-size', '25px')
    viewerButton.style('display', 'block')


}

function imageViewer(){
    
}

function handleFile(file) {
    print(file);
    if (file.type === 'image') {
      img = createImg(file.data, '');
      img.hide();
    } else {
      img = null;
    }
  }