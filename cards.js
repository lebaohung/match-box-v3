var data = {
    pairFlow : [['氵','讠'], ['饣','扌','日'], ['口','又']],
    incorrectMap: {
        '女' : ['日','甘','曷','末'],
        '亻' : ['日','那','找']
    },
    correctMap: {
        '女' : ['子','也','马','未','且','生'],
        '亻' : ['尔','也','我','言','本', '生','立','两','故','旦','牛'],
        '口' : ['马','曷','丩','乞','卑', '斤','那','隹','寸','鸟','欠'],
        '氵' : ['又','去','殳','气','巷', '酉','青','舌'],
        '讠' : ['青','射','舌','殳'],
        '又' : ['隹','寸','鸟','欠'],
        '饣' : ['反','官','曼','交'],
        '扌' : ['戈','奂','受'],
        '日' : ['月','乍']
    },
    correctCombinations : {
        '女子': '好 hǎo',
        '女也': '她 tā',
        '女马': '妈 mā',
        '女未': '妹 mèi',
        '女且': '姐 jiě',
        '女生': '姓 xìng',
        
        '亻尔': '你 nǐ',
        '亻也': '他 tā',
        '亻我': '俄 é',
        '亻言': '信 xīn',
        '亻本': '体 tǐ',
        '亻生': '住 zhù',
        '亻立': '位 wèi',
        '亻两': '俩 liǎ',
        '亻故': '做 zuò',
        '亻旦': '但 dān',
        '亻牛': '件 jiàn',
        
        '口马': '吗 ma',
        '口曷': '喝 hē',
        '口丩': '叫 jiào',
        '口乞': '吃 chī',
        '口卑': '啤 pí',
        '口斤': '听 tīng',
        '口那': '哪 nǎ',
        '口隹': '唯 wéi',
        '口寸': '吋 cùn',
        '口鸟': '鸣 míng',
        '口欠': '吹 chuī',
        
        '氵又': '汉 hàn',
        '氵去': '法 fǎ',
        '氵殳': '没 méi',
        '氵气': '汽 qì',
        '氵巷': '港 xiāng',
        '氵酉': '酒 jiǔ',
        '氵青': '清 qīng',
        '氵舌': '活 huó',
        
        '讠青': '请 qǐng',
        '讠射': '谢 xiè',
        '讠舌': '话 huà',
        '讠殳': '设 shè',

        '又隹': '难 nán',
        '又寸': '对 duì',
        '又鸟': '鸡 jī',
        '又欠': '欢 huān',
        
        '饣反': '饭 fàn',
        '饣官': '馆 guǎn',
        '饣曼': '馒 mán',
        '饣交': '饺 jiǎo',
        
        '扌戈': '找 zhǎo',
        '扌奂': '换 huàn',
        '扌受': '授 shòu',
        
        '日月': '明 míng',
        '日乍': '昨 zuó'
    },
    selectedComponents: [],
    result: ''
}
let timerInterval;
let maxMin = 3.75;
let remainingTime = maxMin * 60000; // 5 minutes in milliseconds
let correctPair = [];
let yourLife = 3;

function updateTime() {
    if (remainingTime > 0) {
        remainingTime -= 1000; // Decrement by 1 second (1000 milliseconds)
    } else {
        clearInterval(timerInterval); // Stop the timer when it reaches 0
        disableButtonsInDiv('board')
        if (correctPair.length === Object.keys(data.correctCombinations).length) {
            document.getElementById('message').textContent = 'You winnn!';
        } else if (yourLife ===0) {
            document.getElementById('message').textContent = 'Out of 3 incorrect chooses';
        } else {
            document.getElementById('message').textContent = 'Time is up!';
        }
        document.getElementById("score2").innerHTML  = "Correct: " + correctPair.join(" ,");

        remainingTime = 0;
    }

    let minutes = Math.floor(remainingTime / 60000);
    let seconds = Math.floor((remainingTime % 60000) / 1000);

    // Format numbers to always have two digits
    minutes = String(minutes).padStart(2, '0');
    seconds = String(seconds).padStart(2, '0');

    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function startTimer() {
    if (!timerInterval) {
        timerInterval = setInterval(updateTime, 1000);
        document.getElementById('message').textContent = ''; // Clear any previous message
    }
    enableButtonsInDiv('board');
    hideStartButton();
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    remainingTime = maxMin * 60000; // Reset to 5 minutes
    document.getElementById('timer').textContent = '0%d:%s'.replace("%d", Math.floor(maxMin).toString()).replace("%s", ((maxMin - Math.floor(maxMin)) * 60000 / 1000).toString());
    document.getElementById('message').textContent = ''; // Clear any previous message
    disableButtonsInDiv('board');
}

let resultTimer;

function selectComponent(event) { 
    const selected = event.target.innerHTML;
    const selectedComponents = data.selectedComponents;
    const correctCombinations = data.correctCombinations;

    if (selectedComponents.length < 2) {
        selectedComponents.push(selected);
        data.selectedComponents = selectedComponents;
    }

    if (selectedComponents.length === 2) {
        clearTimeout(resultTimer)
        const combined = selectedComponents.join('');
        let result = correctCombinations[combined];
        if (result) {
            if (!correctPair.includes(result)) {
                correctPair.push(result);
            }
            document.getElementById("score").innerHTML = "- Score: " + correctPair.length;
            checkNextLevel();
        } else {``
            if (--yourLife === 0) {
                remainingTime = 0;   
            }
            result = '错误组合';
        }
        
        document.getElementById("result").innerHTML  = result;
        data.selectedComponents = [];
        resultTimer = resetSelection();
    }
}

function resetSelection() {
    return setTimeout(() => {
        document.getElementById("result").innerHTML  = '';
        enableButtonsInDiv('board')
    }, 4000);
}

let currentLevel = 0;

function checkNextLevel() {
    let maxScore = 0;
    for (let i = 0; i <= currentLevel; i++) {
        data.pairFlow[i].forEach(item => maxScore += data.correctMap[item].length);
    }
    if (correctPair.length === maxScore) {
        if (currentLevel + 1 !== data.pairFlow.length) {
            document.getElementById('center').remove();
            document.getElementById('board').querySelectorAll('button').forEach(i => i.remove())
        }
        nextLevel(++currentLevel)
    }
}


var charList = [];
var board = [];

window.onload = function () {
    resetTimer();
    nextLevel(0)
}

function nextLevel(centerIndex) {
    shuffleCards(centerIndex);
    startGame(centerIndex);
}

function shuffleCards(centerIndex) {
    if (centerIndex === data.pairFlow.length) return;
    for (let i = 0; i < data.pairFlow[centerIndex].length; i++) {
        charList.push(data.pairFlow[centerIndex][i]);
    }
    for (let i = 0; i < data.pairFlow[centerIndex].length ; i++) {
        if (data.correctMap.hasOwnProperty(data.pairFlow[centerIndex][i])) {
            charList.push(...data.correctMap[data.pairFlow[centerIndex][i]]);
        }
    }
    charList = [...new Set(charList)];
    //shuffle
    for (let i = 0; i < charList.length; i++) {
        let j = Math.floor(Math.random() * charList.length); //get random index
        //swap
        let temp = charList[i];
        charList[i] = charList[j];
        charList[j] = temp;
    }
}

function startGame(centerIndex) {
    if (currentLevel + 1 <= data.pairFlow.length) {
        document.getElementById("level").innerHTML = "Level: " + (currentLevel + 1) + "/" + data.pairFlow.length;
    }


    if (centerIndex < data.pairFlow.length) {

        for (let r = 0; r < 4; r++) {
            let row = [];
            for (let c = 0; c < 5; c++) {
                let character = charList.pop();
                if (character !== null) {
                    row.push(character); //JS

                    let box = document.createElement("button");
                    box.setAttribute("id", "button2");
                    box.setAttribute("class", "button, clickable");
                    box.textContent = character;
                    box.setAttribute("disabled", true)

                    box.addEventListener("click", selectComponent);
                    document.getElementById("board").append(box);
                }

            }
            board.push(row);
        }
        
        
        for (let i = 0; i < data.pairFlow[centerIndex].length; i++) {
            let center = document.createElement("button");
            center.setAttribute("id", "center");
            center.setAttribute("class", "side-buttons, clickable");
            center.textContent = data.pairFlow[centerIndex][i];
            if (centerIndex === 0) {
                center.setAttribute("disabled", true)
            }

            center.addEventListener("click", selectComponent);
            document.getElementById("board").append(center);
            addListenerChangeColor(center)
        }
        let charLength = charList.length;
        for (let j = 0; j < Math.floor(charLength / 4) ; j++) 
    } else {
        remainingTime = 0;
    }
}

let lastClickedButton = null;

function addListenerChangeColor(item) {
    item.addEventListener('click', function () {
        if (lastClickedButton) {
            lastClickedButton.classList.remove('clicked');
            lastClickedButton = null;
        } else {
            this.classList.add('clicked');
            lastClickedButton = this;
        }
    });
}

function disableButtonsInDiv(divId) {
    const div = document.getElementById(divId);
    const buttons = div.querySelectorAll('button');
    buttons.forEach(button => button.disabled = true);
}

function enableButtonsInDiv(divId) {
    const div = document.getElementById(divId);
    const buttons = div.querySelectorAll('button');
    buttons.forEach(button => button.disabled = false);
}

function hideStartButton() {
    const startButton = document.getElementById('startButton');
    startButton.style.display = 'none';
}