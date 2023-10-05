/*!
 * Funções úteis para o funcionamento
 */

// Load view na divMain do Sistema
function loadView(url){
    $("#divMain").load(url);
}

// Altera o número de jogadores
function changeIntPlayer(flDirection = ""){

    let currentIntPlayer = $("#divPlayers #intPlayer").val();

    let newIntPlayer = 0;
    switch(flDirection){
        case "plus": newIntPlayer = (parseInt(currentIntPlayer) + 1); break;
        case "minus": newIntPlayer = (parseInt(currentIntPlayer) - 1); break;
        default : newIntPlayer = parseInt(currentIntPlayer); break;
    }

    //Limita entre 1 e 4 jogadores
    newIntPlayer = (newIntPlayer > 4) || (newIntPlayer < 2) ? currentIntPlayer : newIntPlayer;

    //Joga o número de jogadores na Storage
    sessionStorage.intPlayers = newIntPlayer;

    //Joga o número de jogadores no campo
    $("#divPlayers #intPlayer").val(newIntPlayer);
}

// Gera tabelas aleatórias para o Game
function createRandomBoard(){

    // Html da GameBoard
    let strHtmlBoard = '<div style="position: relative; width: 100%; height: 100%">';

    strHtmlBoard += '<table border="1" style="height: 100%; border-width: 1px; border-style: solid; width: 100%; border-collapse: collapse; position: absolute">';

    //Número de cada célula
    let intCell = 50;

    let blReverse = false;

    let dsBorderBottom = ""

    // Percorre as linhas
    for(let iLine = 0; iLine < 5; iLine++){

        // Abre Linha
        strHtmlBoard += '<tr>';

        if(iLine != 0) {
            if (iLine % 2 == 1) {
                blReverse = true;
                intCell = intCell - 9;
            } else {
                blReverse = false;
                intCell = intCell - 11;
            }
        }

        // Percorre as linhas
        for(let iColumn = 0; iColumn < 10; iColumn++){

            dsBorderBottom = '';
            if(intCell % 10 != 1 && intCell > 10)
                dsBorderBottom = 'border-bottom: 5px solid #2c2c2c;';

            let strBackGround = getRandomColor();
            strHtmlBoard += '<td id="boardCell'+ intCell +'" style="' + dsBorderBottom + 'background: '+strBackGround+'; text-align: right; vertical-align: top; padding: 10px"><span style="opacity: 0.4;">'+ intCell +'</span></td>';

            intCell = blReverse ? intCell + 1 : intCell - 1;

        }

        // Fecha Linha
        strHtmlBoard += '</tr>';

    }

    strHtmlBoard += '</table>';

    strHtmlBoard += '<img src="../image/escadas.PNG" style="width: 100%; height: 100%; left: 0px; position: absolute">';
    strHtmlBoard += '<img src="../image/serpentes.PNG" style="width: 100%; height: 100%; left: 0px; position: absolute">';

    strHtmlBoard += '</div>';

    return strHtmlBoard;
}

// Cria cor hexadecimal aleatória
function getRandomColor(){

    let arrColors = ["#cacaff",
                     "#ffc7c7",
                     "#f8c1ff",
                     "#d9d6d6",
                     "#9d9898",
                     "#ffefcb",
                     "#ffcbea",
                     "#d8fac5"];

    let color = arrColors[Math.floor(Math.random() * 6)];

    return color;
}

// Cria conta aleatória para questionento do jogo
function getRandomCalculation(number) {

    const arrOperators = ["+","-","*","/"];

    //First element
    let intFirstElement = Math.floor(Math.random() * 15);
    //Second element
    let intSecondElement = Math.floor(Math.random() * 15);

    //Operator
    let intOperator = Math.floor(Math.random() * 4);

    let dsCalculation = "";
    let intResult = 0;

    do{

        dsCalculation = "";

        //Evita divisões por zero
        if(intOperator == 3)
            intSecondElement = Math.floor(Math.random() * 14) + 1;

        dsCalculation += intFirstElement.toString();
        dsCalculation += " " + arrOperators[intOperator] + " ";
        dsCalculation += intSecondElement.toString();

        intResult = eval(dsCalculation);

    } while(!Number.isInteger(intResult));

    //Guarda na storage para verificação posterior
    sessionStorage.intResult = intResult;

    return dsCalculation;
}

//Verifica a resposta do usuário
function checkResultCalculation(intAnswer) {

    enableCalculation(false);

    //Limpa os campos
    $("#divTimer").html("");
    $("#divMain #dsCalculation").val("");
    $("#dsResult").val("");

    clearInterval(sessionStorage.objTimer);

    if(sessionStorage.intResult == intAnswer){
        correctAnswer();
    }
    else{
        wrongAnswer();
    }
}

//Mostra mensagem de aviso de rodada para jogadores
function showAdvicePlayer(){

    // Confirmação
    let dsContent = '<div id="dsAdvice" style="display: none;font-size: 18pt;">';
    dsContent += 'É a vez do Jogador ' + sessionStorage.currentPlayer + '!';
    dsContent += '<button id="btnReady" class="btn" style="font-size: 28pt; padding: 0 20px; margin-top: 12px;" onclick="setPlayerReady()">Pronto</button>';
    dsContent += '</div>';

    //Joga o conteúdo na tela
    setTimeout(function (){
        showMessage(dsContent);
    },400);

}

//Confirmação do jogador
function setPlayerReady() {

    //Cria uma conta para a rodada
    $("#divMain #dsCalculation").val(getRandomCalculation());

    hideMessage();

    enableCalculation(true);

    startTimer();
}

//Inicia o timer da rodada
function startTimer(){

    let timeLeft = 10;
    sessionStorage.objTimer = setInterval(function(){
    if(timeLeft <= 0){
        checkResultCalculation('');
    }
    else {
        $("#divTimer").html('<div><span>' + timeLeft + 's</span></div>');
    }
        timeLeft -= 1;
    }, 1000);

}

//Funcão chamada quando a resposta foi incorreta ou o tempo se esgotou
function wrongAnswer(){

    // Confirmação
    let dsContent = '<div id="dsAdvice" style="display: none;font-size: 32pt; text-align: center;">';
    dsContent += 'Resposta Incorreta!';
    dsContent += '</div>';

    showMessage(dsContent);

    setTimeout(function (){
        hideMessage();
        setTimeout(function () {
            setNextPlayer(parseInt(sessionStorage.currentPlayer) + 1);
        },400);
    },3000);

}

//Funcão chamada quando a resposta foi correta
function correctAnswer(){

    // Confirmação
    let dsContent = '<div id="dsAdvice" style="display: none;font-size: 32pt; text-align: center;">';
    dsContent += 'Resposta Correta!';
    dsContent += '</div>';

    showMessage(dsContent);

    setTimeout(function (){
        hideMessage();
        setTimeout(function () {

            rollDice();
        },400);
    },3000);

}

//Mostra mensagem na tela
function showMessage(dsMessage){

    //Mostra a tela de aviso
    $("#divMessage").css("display","block");
    $("#divMessage").animate({ height: "25%", width: "30%"}, 400);

    //Joga o conteúdo na tela
    $("#divMessage").html(dsMessage);

    setTimeout(function () {
        $("#dsAdvice").fadeIn(200);
    },400);

}

//Esconde mensagem na tela
function hideMessage(){

    //Limpa a tela de confirmação
    $("#divMessage").html("");

    //Esconte a tela de confirmação
    $("#divMessage").animate({ height: "0%", width: "0%"}, 400);
    setTimeout(function (){
        $("#divMessage").css("display","none");
    },400);
}

//Função para setar próximo jogador da rodada
function setNextPlayer(intPlayer){

    if(intPlayer > sessionStorage.intPlayers)
        intPlayer = 1;

    //Armazena o jogador da rodada atual
    sessionStorage.currentPlayer = intPlayer;

    showAdvicePlayer();
}

//Função para habilita o campo e o botão ed cálculo
function enableCalculation(blEnable){

    if(!blEnable) {
        $("#dsResult").attr("disabled", "disabled");
        $("#btnCalculation").attr("disabled", "disabled");
    }
    else{
        $("#dsResult").removeAttr("disabled");
        $("#btnCalculation").removeAttr("disabled");
        $("#divMain #dsResult").focus();
    }
}

function rollDice(){

    let intDiceFace = Math.floor(Math.random() * 6) + 1;
    let dsImage = '<img id="imgDice" src="../image/dice0'+intDiceFace+'.png" style="width: 200px; height: 200px; display: none;">';

    $("#divDice").html(dsImage);

    setTimeout(function () {
        $("#imgDice").fadeIn(400);
    },400);

    setTimeout(function (){
        let intDistance = intDiceFace;
        movePlayer(intDistance);
    },3000);
}

// Função para criação de puppets para cada jogador
function createPlayerPieces(){

    let dsHtmlPlayers = '';
    let arrPlayerColor = ["#bb3333","#33bb33","#3333bb","#bbbb33"];

    for(let i = 0; i < sessionStorage.intPlayers; i++){

        dsHtmlPlayers += '<div id="divPlayer'+(i + 1)+'" style="border: 3px solid #2c2c2c; font-size: 25px; border-radius: 100px; background: '+arrPlayerColor[i]+'; width: 35px; height: 40px; position: absolute;">'+ (i+1) +'</div>';
    }

    $("#divPlayers").append(dsHtmlPlayers);

    setPlayersInitialPosition();
}

//Movimenta os jogadores
function movePlayer(intSteps){

    let intPlayer = sessionStorage.currentPlayer;

    let checkCorner = "";
    let checkHeight = "";
    let dsDirection = "";
    let dsDistance = "";
    let intDelay = 300;

    //Pega coordenadas do jogador no tabuleiro
    checkCorner = parseInt($("#divPlayer"+intPlayer).css("left")) / $("#divPlayer"+intPlayer).parent().width() * 100;
    checkHeight = parseInt($("#divPlayer"+intPlayer).css("top")) / $("#divPlayer"+intPlayer).parent().height() * 100;

    //Verifica se chegou a casa final
    if(checkCorner < 10 && checkHeight < 20){
        return endGame();
    }

    if(intSteps > 0){

        dsDirection = (checkHeight < 20 || (checkHeight > 40 && checkHeight < 60) || checkHeight > 80) ? "backwards" : "forwards";

        if(checkCorner > 90 && ((checkHeight > 20 && checkHeight < 40) || (checkHeight > 60 && checkHeight < 80))){
            $("#divPlayer"+intPlayer).animate( { top : "-=19%"}, 300);
            dsDirection = "backwards";
            intSteps--;
            intDelay += 400;
        }
        if(checkCorner < 10 && (checkHeight > 80 || (checkHeight > 40 && checkHeight < 60))){
            $("#divPlayer"+intPlayer).animate( { top : "-=19%"}, 300);
            dsDirection = "forwards";
            intSteps--;
            intDelay += 400;
        }

        dsDistance = dsDirection == "forwards" ? "+=9.83%" : "-=9.83%";

        if(intSteps > 0)
            $("#divPlayer"+intPlayer).animate( { left : dsDistance}, 300);

        setTimeout(function (){
            movePlayer((intSteps - 1));
        },intDelay);
    }
    else{
        checkShortCut();
    }
}

function setPlayersInitialPosition() {

    let arrPositions = [{ left: "91%", top: "83%" },
                        { left: "94%", top: "83%" },
                        { left: "91%", top: "88%" },
                        { left: "94%", top: "88%" }];

    for (let i = 0; i < sessionStorage.intPlayers; i++) {
        $("#divPlayer"+(i+1)).animate(arrPositions[i], 1);
    }
}

function checkShortCut(){

    let intPlayer = sessionStorage.currentPlayer;

    let checkCorner = parseInt($("#divPlayer"+intPlayer).css("left")) / $("#divPlayer"+intPlayer).parent().width() * 100;
    let checkHeight = parseInt($("#divPlayer"+intPlayer).css("top")) / $("#divPlayer"+intPlayer).parent().height() * 100;

    //ESCADAS

    if((checkHeight > 80 && checkHeight < 100 ) && (checkCorner > 60 && checkCorner < 70)) {
        $("#divPlayer"+intPlayer).animate( {left: "-=9.83%", top: "-=19%" }, 300);
    }
    if((checkHeight > 60 && checkHeight < 80 ) && (checkCorner > 20 && checkCorner < 30)) {
        $("#divPlayer"+intPlayer).animate( {left: "+=9.83%", top: "-=38%" }, 300);
    }
    if((checkHeight > 40 && checkHeight < 60 ) && (checkCorner > 80 && checkCorner < 90)) {
        $("#divPlayer"+intPlayer).animate( {top: "-=19%" }, 300);
    }
    if((checkHeight > 20 && checkHeight < 40 ) && (checkCorner > 60 && checkCorner < 70)) {
        $("#divPlayer"+intPlayer).animate( {left: "+=9.83%", top: "-=38%" }, 300);
    }

    //SERPENTES
    if((checkHeight > 0 && checkHeight < 20 ) && (checkCorner > 20 && checkCorner < 30)) {
        $("#divPlayer"+intPlayer).animate( {left: "-=9.83%", top: "+=38%" }, 300);
    }
    if((checkHeight > 0 && checkHeight < 20 ) && (checkCorner > 50 && checkCorner < 60)) {
        $("#divPlayer"+intPlayer).animate( {top: "+=19%" }, 300);
    }
    if((checkHeight > 40 && checkHeight < 60 ) && (checkCorner > 60 && checkCorner < 70)) {
        $("#divPlayer"+intPlayer).animate( {left: "+=9.83%", top: "+=19%" }, 300);
    }
    if((checkHeight > 60 && checkHeight < 80 ) && (checkCorner > 40 && checkCorner < 50)) {
        $("#divPlayer"+intPlayer).animate( {left: "-=9.83%", top: "+=19%" }, 300);
    }

    setTimeout(function () {
        $("#imgDice").fadeOut(200);
        setNextPlayer(parseInt(intPlayer) + 1);
    },1400);
}

function endGame(){

    // Mensagem de fim de jogo
    let dsContent = '<div id="dsAdvice" style="display: none;font-size: 32pt; text-align: center;">';
    dsContent += 'O Jogador '+ sessionStorage.currentPlayer+' venceu!';
    dsContent += '</div>';


    showMessage(dsContent);

    return true;
}