
import { Position,Piece } from "../../models";
import { TeamType } from "../../Types";

import { tileIsEmptyOrOccupiedByOpp, tileIsOccupied, tileIsOccupiedByOpp } from "./GeneralRules";

export const bishopMove = (initialPosition:Position ,desiredPosition:Position,team:TeamType,boardState:Piece[] ):boolean => {

    for(let i = 1; i<8;i++){
        //upright
        if (desiredPosition.x>initialPosition.x&&desiredPosition.y>initialPosition.y) {
            let passedPosition=new Position(initialPosition.x+i,initialPosition.y+i);
            if (passedPosition.samePosition(desiredPosition)) {
                if (tileIsEmptyOrOccupiedByOpp(passedPosition,boardState,team)) {
                    return true;
                }
            }else{
                if (tileIsOccupied(passedPosition,boardState)) {
                    break;
                }
            }                  
        }


        //bottomright
        if (desiredPosition.x>initialPosition.x&&desiredPosition.y<initialPosition.y) {
            let passedPosition=new Position(initialPosition.x+i,initialPosition.y-i);
            if (passedPosition.samePosition(desiredPosition)) {
                if (tileIsEmptyOrOccupiedByOpp(passedPosition,boardState,team)) {
                    return true;
                }
            }else{
                if (tileIsOccupied(passedPosition,boardState)) {
                    break;
                }
            }
        }
        
        if (desiredPosition.x<initialPosition.x&&desiredPosition.y<initialPosition.y) {
            let passedPosition=new Position(initialPosition.x-i,initialPosition.y-i);
            if (passedPosition.samePosition(desiredPosition)) {
                if (tileIsEmptyOrOccupiedByOpp(passedPosition,boardState,team)) {
                    return true;
                }
            }else{
                if (tileIsOccupied(passedPosition,boardState)) {
                    break;
                }
            }
        }
        


        if (desiredPosition.x<initialPosition.x&&desiredPosition.y>initialPosition.y) {
            let passedPosition=new Position(initialPosition.x-i,initialPosition.y+i);
            if (passedPosition.x === desiredPosition.x && passedPosition.y=== desiredPosition.y) {
                if (tileIsEmptyOrOccupiedByOpp(passedPosition,boardState,team)) {
                    return true;
                }
            }else{
                if (tileIsOccupied(passedPosition,boardState)) {
                    break;
                }
            }
        }
        
    }
    return false;
}



export const getPossibleBishopMoves = (bishop: Piece, boardState: Piece[]): Position[] =>{
    const possibleMoves: Position[] = [];
    for(let i = 1; i<8;i++){
        const destination=new Position(bishop.position.x+i,bishop.position.y+i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,bishop.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8;i++){
        const destination=new Position(bishop.position.x+i,bishop.position.y-i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,bishop.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8;i++){
        const destination=new Position(bishop.position.x-i,bishop.position.y-i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,bishop.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    for(let i = 1; i<8;i++){
        const destination=new Position(bishop.position.x-i,bishop.position.y+i);
        if (!tileIsOccupied(destination,boardState)) {
            possibleMoves.push(destination);
        }else if (tileIsOccupiedByOpp(destination,boardState,bishop.team)) {
            possibleMoves.push(destination);
            break;
        }else {
            break;
        }
    }
    return possibleMoves;
}
