//eye stuff
const fallOffMultiplier = 45 //lower value = more range.

const anchor = document.getElementById('anchor');
const rect = anchor.getBoundingClientRect();
const anchorX = rect.left + rect.width / 2;
const anchorY = rect.top + rect.height / 2;

document.addEventListener('mousemove', (e) =>{
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distanceX = anchorX - mouseX;
    const distanceY = anchorY - mouseY;

    const norm = Math.sqrt(distanceX **2 + distanceY **2)
    const scaledValue = norm / window.innerHeight;
    const fallOff = (scaledValue * fallOffMultiplier * (window.innerHeight / 700)) + 1;

    const x = distanceX / fallOff;
    const y = distanceY / fallOff;

    const eyes = document.querySelectorAll('.eye');
    eyes.forEach(eye => {
        eye.style.transform = `translateX(${-x}px) translateY(${-y}px)`;
    })
})

//text stuff
const inquiryElement = document.getElementById('inquiry');
const responseOptionsElement = document.getElementById('response__options');

let state = {};

function startGame(){
    state = {};
    showInquiryNode(1);
}

function showInquiryNode(inquiryNodeIdex){
    const inquiryNode = inquiryNodes.find(inquiryNode => inquiryNode.id === inquiryNodeIdex);
    inquiryElement.innerText = inquiryNode.text;
    while (responseOptionsElement.firstChild){
        responseOptionsElement.removeChild(responseOptionsElement.firstChild);
    }

    inquiryNode.responses.forEach(response =>{
        if(showResponse(response)){
            const responseElement = document.createElement('div');
            responseElement.innerHTML = response.text;
            responseElement.classList.add('response');
            responseElement.addEventListener('click', () => selectResponse(response));
            responseOptionsElement.appendChild(responseElement);
        }
    })
}

function showResponse(response){
    return response.requiredState == null || response.requiredState(state)
}

function selectResponse(response){
    const nextInquiryNodeID = response.nextInquiry;
    if(nextInquiryNodeID <= 0){
        return startGame();
    }
    state = Object.assign(state, response.setState);
    showInquiryNode(nextInquiryNodeID);
}

const inquiryNodes = [
    {
        id: 1,
        text: 'you are in a candy shop but can only afford one item',
        responses: [
            {
                text: 'buy a chocolate bar',
                setState: { candy: true },
                nextInquiry: 2
            },
            {
                text: 'buy a lolipop',
                setState: { candy: true },
                nextInquiry: 2
            },
            {
                text: 'dont buy anything',
                setState: { money: true },
                nextInquiry: 2
            }
        ]
    },
    {
        id: 2,
        text: 'you leave the shop. there is a begger outside',
        responses: [
            {
                text: 'give the begger money',
                requiredState: (currentState) => currentState.money,
                setState: {money: false, helpedBegger: true},
                nextInquiry: 4
            },
            {
                text: 'ignore the begger',
                nextInquiry: 4
            }
        ]
    },
    {
        id: 4,
        text: 'while walking home a mugger jumps out at you demanding you hand over all your money',
        responses: [
            {
                text: 'give the mugger your money',
                requiredState: (currentState) => currentState.money,
                setState: {money: false},
                nextInquiry: 5
            },
            {
                text: 'shout for help',
                requiredState: (currentState) => currentState.helpedBegger,
                nextInquiry: 6
            },
            {
                text: 'give the mugger your candy',
                requiredState: (currentState) => currentState.candy,
                setState: {candy: false},
                nextInquiry: 7
            },
            {
                text: 'try and run away',
                nextInquiry: 7
            }
        ]
    },
    {
        id: 5,
        text: 'the mugger is satisfied you are free to live your life.',
        responses: [
            {
                text: 'restart',
                nextInquiry: -1
            }
        ]
    },
    {
        id: 6,
        text: 'the begger hears your call and rushes over. the mugger runs away. you are free to live your life.',
        responses: [
            {
                text: 'restart',
                nextInquiry: -1
            }
        ]
    },
    {
        id: 7,
        text: 'the mugger shanks you. you are dead.',
        responses: [
            {
                text: 'restart',
                nextInquiry: -1
            }
        ]
    }
]

startGame();