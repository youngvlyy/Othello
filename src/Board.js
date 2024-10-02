import React, { useState } from 'react';

let IsBlackStone = false;

let moveTimes = 4;
let whiteStones = 0;
let blackStones = 0;
const Board = ({ boardLength }) => {

    // n이 짝수인지 확인하고, 아니면 에러 처리
    if (boardLength % 2 !== 0) {
        throw new Error('n은 짝수여야 합니다.');
    }

    // boardLength x boardLength 크기의 2차원 배열을 빈 값으로 초기화
    const initialBoard = Array(boardLength).fill(null).map(() => Array(boardLength).fill(null));

    // board 상태를 관리
    const [board, setBoard] = useState(initialBoard);

    
    const initStone = () => {
        initialBoard[3][3] = initialBoard[4][4] = "○";
        initialBoard[4][3] = initialBoard[3][4] = "●";
    }

    initStone();

    // 셀 클릭 시 값 변경하는 함수
    const handleClick = (selectedX, selectedY) => {
        console.log('누른 위치: %d, %d', selectedX, selectedY);

        // 이미 값이 있을 경우 변경하지 않음
        if (board[selectedX][selectedY] !== null)
            return null;

        if(Move8Ways(selectedX, selectedY, board)){
            ++moveTimes;
            IsBlackStone = !IsBlackStone;
            console.log(moveTimes);

            // 원본 배열을 복사 (얕은 복사)
            const newBoard = board.slice();
            // 배열 상태 업데이트
            setBoard(newBoard);
        }
        

        
    };

    // 8방향을 체크하는 더미 함수


    const Move8Ways = (x, y, board) => {
        const directions = [
            [0, -1], // 상
            [1, -1],  // 하
            [1, 0], // 좌
            [1, 1],  // 우
            [0, 1], // 좌상 대각선
            [-1, 1],  // 우상 대각선
            [-1, 0],  // 좌하 대각선
            [-1, -1]    // 우하 대각선
        ];

        let IsSucceeded = false;

        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];

            const dx = dir[0]; // x 축 변화값
            const dy = dir[1]; // y 축 변화값

            
            const checkCurrentWay = (x, y, board) => {
                let cur_x = x;
                let cur_y = y;
                const originStone = IsBlackStone ? "●" : "○";

                //라인에 둔 돌과 같은 색상이 있는지 체크
                while (true) {                
                    let next_x = cur_x + dx;
                    let next_y = cur_y + dy;

                    if (next_x < 0 || next_x >= boardLength || next_y < 0 || next_y >= boardLength) // 범위 검사
                        return false;

                    const nextStone = board[next_x][next_y] // 기준의 다음 돌

                    if( nextStone == null)
                        return false;

                    if (originStone != nextStone){
                        cur_x = next_x;
                        cur_y = next_y;
    
                        continue;
                    }

                    if (cur_x == x && cur_y == y)
                        return false;

                    return true;
                }
            }

            
 

            if(checkCurrentWay(x, y, board)){
                IsSucceeded = true;
               
                const unifyCurWayStones = (x,y) => {
                
                    const originStone = IsBlackStone ? "●" : "○";
                    let cur_x = x;
                    let cur_y = y;
                        
                    
                    while(true){
                        let next_x = cur_x + dx;
                        let next_y = cur_y + dy;

                        if(board[next_x][next_y] == null)
                            return false;

                        if(board[next_x][next_y] !== originStone){
                            board[next_x][next_y] = originStone;
                        
                            cur_x = next_x;
                            cur_y = next_y;
                            continue;
                        }else{
                            break;
                        }
                    }
                    
                }
                
                unifyCurWayStones(x, y);
            }
            
        };

        if(IsSucceeded){
            board[x][y] = IsBlackStone ? "●" : "○";
        }
        
        return IsSucceeded;
    };

    const onlyCheck8ways = (x, y, board) => {
        const directions = [
            [0, -1], // 상
            [1, -1],  // 하
            [1, 0], // 좌
            [1, 1],  // 우
            [0, 1], // 좌상 대각선
            [-1, 1],  // 우상 대각선
            [-1, 0],  // 좌하 대각선
            [-1, -1]    // 우하 대각선
        ];

        let IsSucceeded = false;

        //8방향을 다 보고 빠져나감
        for (let i = 0; i < directions.length; i++) {
            const dir = directions[i];

            const dx = dir[0]; // x 축 변화값
            const dy = dir[1]; // y 축 변화값

            let cur_x = x;
            let cur_y = y;
            const originStone = IsBlackStone ? "●" : "○";
            //라인에 둔 돌과 같은 색상이 있는지 체크
            while (true) {                
                let next_x = cur_x + dx;
                let next_y = cur_y + dy;
                
                // 범위 검사
                if (next_x < 0 || next_x >= boardLength || next_y < 0 || next_y >= boardLength){
                    break;
                } 
                const nextStone = board[next_x][next_y] // 기준의 다음 돌
                if( nextStone == null)
                    break;

                if (originStone != nextStone){
                    cur_x = next_x;
                    cur_y = next_y;

                    continue;
                }
                if (cur_x == x && cur_y == y)
                    break;

                IsSucceeded = true;
                break;
            }  
        };

        return IsSucceeded;
        
    };



    let nullkan = 0;
    let noWaynullkan = 0;
    let Waynullkan = 0;
    

    const Null = () => {
        for(let i = 0; i<boardLength; ++i){
            for(let j = 0; j< boardLength; ++j){
                //빈공간
                if(board[i][j] === null){
                    ++nullkan;
                    
                    //빈공간일때 둘곳이 없는 수
                    console.log(onlyCheck8ways(i, j, board));
                    if(onlyCheck8ways(i, j, board)) {
                        ++Waynullkan;

                    }

                    //noWaynullkan 을 바로 반환하고 싶어서 이렇게했는데 안됌.
                    // if(onlyCheck8ways(i, j, board) == false) {
                    //     ++noWaynullkan;

                    // }
                    
                }

                
                
            }
        }
        noWaynullkan = nullkan - Waynullkan;
        console.log('Waynullkan =', Waynullkan);
        console.log('nullkan =', nullkan);
        console.log('noWaynullkan =', noWaynullkan);
    }

    Null();

    const Result = () => {

        if(moveTimes === boardLength * boardLength){
            // 게임이 끝남.
            // 흰돌과 검은돌의 수를 세어 승자를 가림.
            // const getResult = () => {
                for(let i=0; i< boardLength; ++i){
                    for(let j = 0; j< boardLength; ++j){
                        if(board[i][j] == "○" )
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
        else if(noWaynullkan!==0 && nullkan!==0 && noWaynullkan === nullkan){
            alert("패스!");
            IsBlackStone = !IsBlackStone;
            
            console.log('같을때 IsBlackStone =', IsBlackStone);
        }

        
    }
    Result();


    return (
        <div>
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

            <div style={{textAlign : 'left', marginTop : '10px'}}>누구차례? : {IsBlackStone ? "●" : "○"}</div>
        </div>
    );
};

export default Board;
