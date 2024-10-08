import React, { useState } from 'react';




const directions = [
    [-1,  0],   // 상
    [1,   0],   // 하
    [0,  -1],   // 좌
    [0,   1],   // 우
    [-1, -1],   // 좌상 대각선
    [-1,  1],   // 우상 대각선
    [1,  -1],   // 좌하 대각선          
    [1,   1],   // 우하 대각선
];

let isBlackStone = false;

let putTimes = 4;       // 돌을 둔 횟수 
let whiteStones = 0;    // 백돌 수
let blackStones = 0;    // 흑돌 수

let emptyCell = 0;      // 비어있는 칸
let invalidCell = 0;    // 비어있는 칸 중 둘수없는 칸
let validCell = 0;      // 비어있는 칸 중 둘수있는 칸

const Board = ({ boardLength }) => {

    // n이 짝수인지 확인하고, 아니면 에러 처리
    if (boardLength % 2 !== 0) {
        throw new Error('n은 짝수여야 합니다.');
    }

    // boardLength x boardLength 크기의 2차원 배열을 빈 값으로 초기화
    const initialBoard = Array(boardLength).fill(null).map(() => Array(boardLength).fill(null));

    // board 상태를 관리
    const [board, setBoard] = useState(initialBoard);

    //초기값 생성
    initialBoard[boardLength/2 - 1][boardLength/2 - 1] = initialBoard[boardLength/2][boardLength/2] = "○";
    initialBoard[boardLength/2][boardLength/2 - 1] = initialBoard[boardLength/2 - 1][boardLength/2] = "●";
    


    // 셀 클릭 시 값 변경하는 함수
    const handleClick = (selectedX, selectedY) => {
        
        if (check8Directions(selectedX, selectedY, isBlackStone, board)) {

            // check8Directions에서 이미 유효성 검사가 끝났으니 안에서 경계검사 없이 돌을 둔다.
            putStone(selectedX, selectedY, isBlackStone, board);

            // 돌을 두었으니 나머지 상태값들을 최신화해준다.
            ++putTimes;
            isBlackStone = !isBlackStone;

            
            // 원본 배열을 복사 (얕은 복사)
            const newBoard = board.slice();

            // 배열 상태 업데이트
            setBoard(newBoard);
    
        }
    };

    // 지정한 위치 + 지정한 방향에 돌을 둘 수 있는지 검사하는 함수
    // x : 두고싶은 돌의 x축 위치
    // y : 두고싶은 돌의 y축 위치
    // dir : 검사를 할 방향
    // isBlackStone : 두고 싶은 돌의 색
    // board : 검사할 판
    const check1Direction = (x, y, dir, isBlackStone, board) => {
        const dx = dir[0]; // x 축 변화값
        const dy = dir[1]; // y 축 변화값

        let cur_x = x;
        let cur_y = y;
        const originStone = isBlackStone ? "●" : "○";

        //라인에 둔 돌과 같은 색상이 있는지 체크
        while (true) {                
            let next_x = cur_x + dx;
            let next_y = cur_y + dy;

            // 범위 검사
            if (next_x < 0 || next_x >= boardLength || next_y < 0 || next_y >= boardLength) 
                return false;

            // 기준의 다음 돌
            const nextStone = board[next_x][next_y] 

            //다음돌이 비어있을때
            if(nextStone == null)
                return false;

            //다음돌이 다른색돌일때
            if (originStone != nextStone){
                cur_x = next_x;
                cur_y = next_y;

                continue;
            }

            //처음 시작할 때
            if (cur_x == x && cur_y == y)
                return false;

            return true;
        }
    }

    // 지정한 위치에 돌을 둘 수 있는지 검사하는 함수
    // x : 두고싶은 돌의 x축 위치
    // y : 두고싶은 돌의 y축 위치
    // isBlackStone : 두고 싶은 돌의 색
    // board : 검사할 판
    const check8Directions = (x, y, isBlackStone, board) => {
        if(board[x][y] !== null){
            return false;
        }

        //8방향을 다 보고 빠져나감
        for (let i = 0; i < directions.length; i++) {
           
            if(check1Direction(x, y, directions[i], isBlackStone, board)){
                return true;
            }
        };

        return false;        
    };

    // x, y에 돌을 두는 함수.
    const putStone = (x, y, isBlackStone, board) => {
        for (let i = 0; i < directions.length; i++) {

            //사이의 돌을 뒤집는 함수
            const turnOverStones = (x, y, dir) => {

                const originStone = isBlackStone ? "●" : "○";
                let cur_x = x;
                let cur_y = y;

                let next_x = cur_x + dir[0];
                let next_y = cur_y + dir[1];

                while (!(board[next_x][next_y] == null || board[next_x][next_y] === originStone)) {
                    
                    board[next_x][next_y] = originStone;

                    cur_x = next_x;
                    cur_y = next_y;
                    next_x = cur_x + dir[0];
                    next_y = cur_y + dir[1];
                }
            }

            if(check1Direction(x, y, directions[i], isBlackStone, board))
                turnOverStones(x, y, directions[i]);
        };

        board[x][y] = isBlackStone ? "●" : "○";

    };

     // 게임의 승패를 평가한다.
     const EvaluateGame = () => {
        for(let i = 0; i<boardLength; ++i){
            for(let j = 0; j< boardLength; ++j){
                //빈공간
                if(board[i][j] === null){
                    ++emptyCell;
                    
                    // 빈공간일때 둘곳이 없는 수
                    
                    if(check8Directions(i, j, isBlackStone, board)) {
                        ++validCell;

                    }

                    //invalidCell 을 바로 반환하고 싶어서 이렇게했는데 안됌.
                    // if(checkValidation(i, j, board) == false) {
                    //     ++invalidCell;

                    // }
                    
                }

                
                
            }
        }
        invalidCell = emptyCell - validCell;

        if (putTimes === boardLength * boardLength) {
            // 게임이 끝남.
            // 흰돌과 검은돌의 수를 세어 승자를 가림.
            // const getResult = () => {
            for (let i = 0; i < boardLength; ++i) {
                for (let j = 0; j < boardLength; ++j) {
                    if (board[i][j] == "○")
                        ++whiteStones;
                    else
                        ++blackStones
                }
            }

            if (whiteStones > blackStones)
                alert("흰돌 승리!");

            else if (whiteStones < blackStones)
                alert("검은돌 승리!");

            else
                alert("무승부!");
        }
        else if (emptyCell > 0 && emptyCell === invalidCell) {
            alert("패스!");
            isBlackStone = !isBlackStone;
            
        }


    }

    EvaluateGame();

    return (
        <div style={{display : 'flex', 
                    flexDirection : 'column', 
                    alignItems : 'center', 
                    paddingTop : '5%'
                    }}
                    >
            {board.map((row, rowIndex) => (
                <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cell, colIndex) => (
                        <div
                            key={colIndex}
                            onClick={() => handleClick(rowIndex, colIndex)}
                            style={{
                                width: '50px',
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid black',
                                cursor: 'pointer',
                            }}
                        >
                            {cell ? cell : ' '}

                        </div>
                    ))}
                </div>
            ))}

            <div style={{textAlign : 'left', marginTop : '10px', fontWeight : 'bold'}}>순서 : {isBlackStone ? "●" : "○"}</div>
        </div>
    );
};

export default Board;


//함수를 board 안에 넣으면 안된다는걸 깨달음
