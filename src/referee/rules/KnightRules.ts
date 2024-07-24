
import { Piece,Position } from "../../models";
import { TeamType } from "../../Types";
import { tileIsEmptyOrOccupiedByOpp } from "./GeneralRules";

export const knightMove = (initialPosition:Position ,desiredPosition:Position,team:TeamType,boardState:Piece[] ):boolean =>{
    for (let i = -1; i < 2; i+=2) {    
        for (let j = -1; j < 2; j+=2) {
            if (desiredPosition.y-initialPosition.y===2*i) {
                if(desiredPosition.x - initialPosition.x === j){
                    if (tileIsEmptyOrOccupiedByOpp(desiredPosition,boardState,team)) {
                        
                        return true;
                    }
                    
                }
            }

            if (desiredPosition.x-initialPosition.x===2*i) {
                if (desiredPosition.y - initialPosition.y === j) {
                    if (tileIsEmptyOrOccupiedByOpp(desiredPosition,boardState,team)) {
                    
                        return true;
                    
                    }
                }   
            }
        }            
    }
    return false;
}

export const getPossibleKnightMoves = (knight: Piece, boardState: Piece[]): Position[] =>{
    const possibleMoves: Position[] = [];
    for (let i = -1; i < 2; i+=2) {    
        for (let j = -1; j < 2; j+=2) {
            const vertMove = new Position(knight.position.x+j,knight.position.y+i*2);
            const horizMove = new Position(knight.position.x + i*2,knight.position.y+j);

            if (tileIsEmptyOrOccupiedByOpp(vertMove,boardState,knight.team)) {
                possibleMoves.push(vertMove);
            }
            if (tileIsEmptyOrOccupiedByOpp(horizMove,boardState,knight.team)) {
                possibleMoves.push(horizMove);
            }
        }            
    }
    return possibleMoves;
}